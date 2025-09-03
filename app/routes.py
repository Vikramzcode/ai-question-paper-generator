import os
import json
import re
from flask import send_file
import uuid
from docx import Document
import io
from flask import Blueprint, request, jsonify, render_template, current_app
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime
import google.generativeai as genai
from .models import Question
from . import db

main = Blueprint("main", __name__)

@main.route("/")
def index():
    return render_template("index.html")


@main.route("/api/generate", methods=["POST"])
def generate_paper():
    data = request.get_json()
    current_app.logger.info(f"Incoming /api/generate payload: {data}")

    subject = data.get("subject")
    class_ = data.get("class")
    board = data.get("schoolBoard")
    school = data.get("schoolName")
    qdist = data.get("questionDistribution", {})
    ddist = data.get("difficultyDistribution", {})
    exam_name = data.get("examName")


    # ---- AI PROMPT ----
    prompt = f"""
    You are an experienced {board} school teacher. 
    Create a question paper for Class {class_}, Subject: {subject}.
    School: {school}

    Question type distribution: {qdist}
    Difficulty distribution: {ddist}

    Output only valid JSON array. Each item must have:
    - type (MCQ, Fill in the Blanks, Short Answer, Long Answer, Case Study, etc.)
    - question (text of the question)
    - marks (marks per question)
    - difficulty (Easy, Medium, Hard)
    - answer (correct answer or solution for the question)
    """


    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # ---- CLEAN & PARSE JSON ----
    raw_text = response.text.strip()

    # Remove ```json ... ```
    json_match = re.search(r"```json\s*(.*?)```", raw_text, re.DOTALL)
    if json_match:
        raw_text = json_match.group(1)

    try:
        questions = json.loads(raw_text)
    except Exception:
        # fallback if not JSON
        questions = [
            {"type": "MCQ", "question": raw_text, "marks": 1, "difficulty": "Medium"}
        ]

    # ---- SAVE TO DB ----
    for q in questions:
        new_q = Question(
            school_name=school,
            board=board,
            class_=class_,
            subject=subject,
            type=q.get("type"),
            difficulty=q.get("difficulty"),
            question=q.get("question"),
            marks=q.get("marks"),
        )
        db.session.add(new_q)
    db.session.commit()

    # ---- UNIQUE ID + SAVE JSON ----
    paper_id = str(uuid.uuid4())[:8]
    papers_dir = os.path.join(current_app.root_path, "static", "papers")
    os.makedirs(papers_dir, exist_ok=True)
    json_path = os.path.join(papers_dir, f"{paper_id}.json")

    summary = {
        "total_questions": len(questions),
        "total_marks": sum(int(q.get("marks", 0)) for q in questions)
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "examName": exam_name,
            "schoolName": school,
            "schoolBoard": board,
            "class": class_,
            "subject": subject,
            "questions": questions,
            "summary": summary
        }, f, indent=2, ensure_ascii=False)



        # ---- PDF GENERATION ----
    pdf_filename = f"paper_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf_dir = os.path.join(current_app.root_path, "static", "papers")
    os.makedirs(pdf_dir, exist_ok=True)
    pdf_path = os.path.join(pdf_dir, pdf_filename)

    from reportlab.lib.units import inch
    from reportlab.platypus import Table

    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    # ===== HEADER =====
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, height - 50, f"{school}")
    c.setFont("Helvetica", 12)

    if exam_name:
        c.drawCentredString(width/2, height - 70, exam_name)
    else:
        c.drawCentredString(width/2, height - 70, f"{board} Board Examination")

    c.drawCentredString(width/2, height - 90, f"Class {class_} - {subject}")

    c.drawRightString(width - 50, height - 110, f"Date: {datetime.now().strftime('%d-%m-%Y')}")

    c.line(50, height - 120, width - 50, height - 120)

    # ===== GROUP BY SECTION =====
    sections = {
        "Multiple Choice": [],
        "Fill in the Blanks": [],
        "Short Answer": [],
        "Long Answer": [],
        "Matching": [],
        "Case Study": []
    }

    for q in questions:
        q_type = q["type"].strip()

        # Normalize synonyms
        if q_type in ["MCQ", "Multiple Choice"]:
            q_type = "Multiple Choice"
        elif q_type in ["Match the Following", "Matching"]:
            q_type = "Matching"
        elif q_type in ["Case Study", "Case"]:
            q_type = "Case Study"

        if q_type in sections:
            sections[q_type].append(q)

    section_titles = {
        "Multiple Choice": "Section A - Multiple Choice Questions",
        "Fill in the Blanks": "Section B - Fill in the Blanks",
        "Short Answer": "Section C - Short Answer Questions",
        "Long Answer": "Section D - Long Answer Questions",
        "Matching": "Section E - Matching Questions",
        "Case Study": "Section F - Case Study"
    }

    y = height - 150
    qnum = 1  # continuous numbering across all sections

    styles = getSampleStyleSheet()
    styleN = styles["Normal"]

    for sec, qlist in sections.items():
        if not qlist:
            continue

        # Section Title (only once per section)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(50, y, section_titles[sec])
        y -= 25

        for q in qlist:
            if sec == "Matching":
                # Matching special layout
                c.setFont("Helvetica-Bold", 11)
                c.drawString(70, y, f"Q{qnum}. Match the following: ({q['marks']} marks)")
                y -= 20
                c.setFont("Helvetica", 11)

                # Expecting AI output like:
                # "Column A: 1. Force, 2. Velocity | Column B: a. Newton, b. m/s"
                text = q["question"]

                colA, colB = [], []
                if "Column A:" in text and "Column B:" in text:
                    parts = text.split("Column B:")
                    colA_text = parts[0].replace("Column A:", "").strip()
                    colB_text = parts[1].strip()
                    colA = [a.strip() for a in re.split(r"[;,]", colA_text) if a.strip()]
                    colB = [b.strip() for b in re.split(r"[;,]", colB_text) if b.strip()]

                if colA and colB:
                    data = [["Column A", "Column B"]] + list(zip(colA, colB))
                    table = Table(data, colWidths=[200, 200])
                    table.wrapOn(c, width, height)
                    table.drawOn(c, 70, y - (20 * len(data)))
                    y -= (20 * len(data) + 20)
                else:
                    p = Paragraph(text, styleN)  # fallback plain text
                    w, h = p.wrap(width - 100, y)
                    p.drawOn(c, 70, y - h)
                    y -= (h + 15)

                qnum += 1
                continue

            # === Normal questions (wrapped text) ===
            text = f"Q{qnum}. {q['question']}   ({q['marks']} marks)"
            p = Paragraph(text, styleN)
            w, h = p.wrap(width - 100, y)
            if y - h < 100:  # page break
                c.showPage()
                y = height - 50
            p.drawOn(c, 70, y - h)
            y -= (h + 15)
            qnum += 1

        y -= 15  # gap between sections



    c.save()




    # ---- RETURN ----
    return jsonify({
        "questions": questions,
        "summary": summary,
        "pdf_url": f"/static/papers/{pdf_filename}",
        "word_url": f"/api/download/word/{paper_id}",
        "answer_key_url": f"/api/download/answer_key/{paper_id}"
    })

@main.route("/api/download/word/<paper_id>", methods=["GET"])
def download_word(paper_id):
    json_path = os.path.join(current_app.root_path, "static", "papers", f"{paper_id}.json")
    if not os.path.exists(json_path):
        return jsonify({"error": "Paper not found"}), 404

    with open(json_path, "r", encoding="utf-8") as f:
        paper = json.load(f)

    doc = Document()
    doc.add_heading(paper.get("examName", "Question Paper"), 0)
    doc.add_paragraph(f"School: {paper.get('schoolName')}")
    doc.add_paragraph(f"Board: {paper.get('schoolBoard')}")
    doc.add_paragraph(f"Class: {paper.get('class')}  Subject: {paper.get('subject')}")
    doc.add_heading("Questions", level=1)
    for i, q in enumerate(paper.get("questions", []), 1):
        doc.add_paragraph(f"Q{i}. {q['question']} ({q['marks']} marks) [{q['difficulty']}]")

    buf = io.BytesIO()
    doc.save(buf)
    buf.seek(0)
    return send_file(buf, as_attachment=True,
                     download_name=f"paper_{paper_id}.docx",
                     mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


@main.route("/api/download/answer_key/<paper_id>", methods=["GET"])
def download_answer_key(paper_id):
    json_path = os.path.join(current_app.root_path, "static", "papers", f"{paper_id}.json")
    if not os.path.exists(json_path):
        return jsonify({"error": "Paper not found"}), 404

    # Load saved paper JSON
    with open(json_path, "r", encoding="utf-8") as f:
        paper = json.load(f)

    # Build answer key (only answers, no questions)
    answer_text = f"Answer Key for {paper.get('subject')} - Class {paper.get('class')}\n\n"
    for i, q in enumerate(paper.get("questions", []), 1):
        answer_text += f"Answer {i}. {q.get('answer', 'Answer not available')}\n\n"

    buf = io.BytesIO(answer_text.encode("utf-8"))
    return send_file(
        buf,
        as_attachment=True,
        download_name=f"answer_key_{paper_id}.txt",
        mimetype="text/plain"
    )



