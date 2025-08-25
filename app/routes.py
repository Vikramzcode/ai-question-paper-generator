import os
import json
import re
from flask import Blueprint, request, jsonify, render_template, current_app
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
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

    # ---- AI PROMPT ----
    prompt = f"""
    You are an experienced {board} school teacher. 
    Create a question paper for Class {class_}, Subject: {subject}.
    School: {school}

    Question type distribution: {qdist}
    Difficulty distribution: {ddist}

    Output only valid JSON array. Each item must have:
    - type (MCQ, Fill in the Blanks, Short Answer, Long Answer, etc.)
    - question (text of the question)
    - marks (marks per question)
    - difficulty (Easy, Medium, Hard)
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

    # ---- PDF GENERATION ----
        # ---- PDF GENERATION ----
    pdf_filename = f"paper_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf_dir = os.path.join(current_app.root_path, "static", "papers")
    os.makedirs(pdf_dir, exist_ok=True)
    pdf_path = os.path.join(pdf_dir, pdf_filename)

    from reportlab.lib.units import inch

    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    # Title section
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, height - 50, f"{school}")
    c.setFont("Helvetica", 12)
    c.drawCentredString(width/2, height - 70, f"{board} Board Examination")
    c.drawCentredString(width/2, height - 90, f"Class {class_} - {subject}")
    c.drawRightString(width - 50, height - 110, f"Date: {datetime.now().strftime('%d-%m-%Y')}")

    # Draw line
    c.line(50, height - 120, width - 50, height - 120)

    # Group questions by type
    sections = {
        "Multiple Choice": [],
        "Fill in the Blanks": [],
        "Short Answer": [],
        "Long Answer": []
    }
    for q in questions:
        if q["type"] in sections:
            sections[q["type"]].append(q)

    y = height - 150
    section_titles = {
        "Multiple Choice": "Section A - Multiple Choice Questions",
        "Fill in the Blanks": "Section B - Fill in the Blanks",
        "Short Answer": "Section C - Short Answer Questions",
        "Long Answer": "Section D - Long Answer Questions"
    }

    for sec, qlist in sections.items():
        if not qlist:
            continue

        # Section title
        c.setFont("Helvetica-Bold", 13)
        c.drawString(50, y, section_titles[sec])
        y -= 25

        c.setFont("Helvetica", 11)
        for i, q in enumerate(qlist, start=1):
            text = f"Q{i}. {q['question']}   ({q['marks']} marks)"
            c.drawString(70, y, text)
            y -= 20

            # Page break if space runs out
            if y < 100:
                c.showPage()
                y = height - 50
                c.setFont("Helvetica", 11)

        y -= 15  # gap between sections

    c.save()


    # ---- RETURN ----
    return jsonify({
        "questions": questions,
        "summary": {
            "total_questions": len(questions),
            "total_marks": sum(int(q.get("marks", 0)) for q in questions)
        },
        "pdf_url": f"/static/papers/{pdf_filename}"
    })
