import { apiClient } from "./api";
import { ReferralResponse } from "@/types/referral.types";

class ReferralService {
  /**
   * Get referral data for a specific user
   */
  async getReferralData(userId: string): Promise<ReferralResponse> {
    try {
      const response = await apiClient.get<ReferralResponse>(`/referrals/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all referrals (admin function)
   */
  async getAllReferrals(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>("/referrals");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const referralService = new ReferralService();
