type ReferralUser = {
  id: string
  name: string
  email: string
  joinedDate: string
  status: 'pending' | 'completed' | 'active' // adjust if more statuses exist
  bonus: number
}

type ReferralResponse = {
  totalReferred: number
  totalBonus: number
  rank: string
  nextRankTarget: number
  referralLink: string
  referrals: ReferralUser[]
}

export type {ReferralResponse,ReferralUser}