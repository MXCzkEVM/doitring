/**
 * @title Blueberry Ring Swagger
 * @description ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

import * as Types from "./index.type";

export const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * @method get
 * @tags Estimate
 */
export async function getEstimateBonusStake(query: Types.GetEstimateBonusStakeQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/estimate/bonus/stake?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.NumericResponse>;
}
/**
 * @method post
 * @tags Doctor
 */
export async function postDoctorDiagnosis(body: Types.DiagnosisBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/doctor/diagnosis`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.DiagnosisResponse>;
}
/**
 * @method post
 * @tags Doctor
 */
export async function postDoctorProof(body: Types.AgentMessageBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/doctor/proof`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.AgentMessageResponse>;
}
/**
 * @method get
 * @tags Season
 */
export async function getSeason(query: Types.GetSeasonQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/season?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.Season>;
}
/**
 * @method get
 * @tags Season
 */
export async function getSeasonMembers(query: Types.GetSeasonMembersQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/season/members?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.MembersResponse>;
}
/**
 * @method post
 * @tags Order
 */
export async function postOrder(body: Types.OrderCreateBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/order`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.Order>;
}
/**
 * @method post
 * @tags Order
 */
export async function postOrderConfirm(body: Types.OrderConfirmBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/order/confirm`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.Order>;
}
/**
 * @method post
 * @tags Agent
 */
export async function postAgent(body: Types.AgentTransactionBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/agent`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.AgentTransactionResponse>;
}
/**
 * @method post
 * @tags Agent
 */
export async function postAgentProof(body: Types.AgentMessageBody, config?: RequestInit) {
  const response = await fetch(`${baseURL}/agent/proof`, {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify(body),
    ...config,
  });
  return response.json() as Promise<Types.AgentMessageResponse>;
}
/**
 * @method get
 * @tags Group
 */
export async function getGroupDetailId(paths: Types.GetGroupDetailIdPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/group/detail/${paths.id}`, {
    ...config,
  });
  return response.json() as Promise<Types.Group>;
}
/**
 * @method get
 * @tags Group
 */
export async function getGroupInviteIn(paths: Types.GetGroupInviteInPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/group/invite/${paths.in}`, {
    ...config,
  });
  return response.json() as Promise<Types.Group>;
}
/**
 * @method get
 * @tags Group
 */
export async function getGroup(query: Types.GetGroupQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/group?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.TokenPageResponse>;
}
/**
 * @method get
 * @tags Group
 */
export async function getGroupDetailIdMembers(paths: Types.GetGroupDetailIdMembersPath, query: Types.GetGroupDetailIdMembersQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/group/detail/${paths.id}/members?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.MemberPageResponse>;
}
/**
 * @method get
 * @tags Group
 */
export async function getGroupCondition(query: Types.GetGroupConditionQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/group/condition?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.BooleanResponse>;
}
/**
 * @method get
 * @tags Group
 */
export async function getGroupConditions(query: Types.GetGroupConditionsQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/group/conditions?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.ConditionsResponse>;
}
/**
 * @method get
 * @tags Ring
 */
export async function getRingSleeps(query: Types.GetRingSleepsQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/ring/sleeps?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.DataPacketResponse>;
}
/**
 * @method get
 * @tags Ring
 */
export async function getRingOxygens(query: Types.GetRingOxygensQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/ring/oxygens?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.DataPacketResponse>;
}
/**
 * @method get
 * @tags Ring
 */
export async function getRingRates(query: Types.GetRingRatesQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/ring/rates?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.DataPacketResponse>;
}
/**
 * @method get
 * @tags Ring
 */
export async function getRingSteps(query: Types.GetRingStepsQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/ring/steps?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.DataPacketResponse>;
}
/**
 * @method get
 * @tags Ring
 */
export async function getRingStepsTotal(query: Types.GetRingStepsTotalQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/ring/steps/total?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.NumericResponse>;
}
/**
 * @method get
 * @tags Ring
 */
export async function getRingWearing(query: Types.GetRingWearingQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/ring/wearing?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.NumericResponse>;
}
/**
 * @method get
 * @tags Ring
 */
export async function getRingClaimedHash(paths: Types.GetRingClaimedHashPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/ring/claimed/${paths.hash}`, {
    ...config,
  });
  return response.json() as Promise<Types.BooleanResponse>;
}
/**
 * @method get
 * @tags User
 */
export async function getUserAddress(paths: Types.GetUserAddressPath, config?: RequestInit) {
  const response = await fetch(`${baseURL}/user/${paths.address}`, {
    ...config,
  });
  return response.json() as Promise<Types.UserResponse>;
}
/**
 * @method get
 * @tags User
 */
export async function getUserScoreTotal(query: Types.GetUserScoreTotalQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/user/score/total?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.NumericResponse>;
}
/**
 * @method get
 * @tags Sign
 */
export async function getSignClaimIntel(query: Types.GetSignClaimIntelQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/sign/claim/intel?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.ClaimIntelResponse>;
}
/**
 * @method get
 * @tags Sign
 */
export async function getSignClaim(query: Types.GetSignClaimQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/sign/claim?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.ClaimSignatureResponse>;
}
/**
 * @method post
 * @tags Sign
 */
export async function postSignClaimCount(query: Types.PostSignClaimCountQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/sign/claim/count?${querystr}`, {
    method: "post",
    ...config,
  });
  return response.json() as Promise<Types.ClaimSignatureResponse>;
}
/**
 * @method get
 * @tags Sign
 */
export async function getSignGroupClaim(query: Types.GetSignGroupClaimQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/sign/group/claim?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.ClaimSignatureResponse>;
}
/**
 * @method get
 * @tags Sign
 */
export async function getSignGroupCreate(query: Types.GetSignGroupCreateQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/sign/group/create?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.SignatureResponse>;
}
/**
 * @method get
 * @tags Sign
 */
export async function getSignGroupJoin(query: Types.GetSignGroupJoinQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/sign/group/join?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.SignatureResponse>;
}
/**
 * @method get
 * @tags Rank
 */
export async function getRankGlobal(config?: RequestInit) {
  const response = await fetch(`${baseURL}/rank/global`, {
    ...config,
  });
  return response.json() as Promise<Types.UsersResponse>;
}
/**
 * @method get
 * @tags Rank
 */
export async function getRankGroup(query: Types.GetRankGroupQuery, config?: RequestInit) {
  const querystr = new URLSearchParams(Object.entries(query || {}));
  const response = await fetch(`${baseURL}/rank/group?${querystr}`, {
    ...config,
  });
  return response.json() as Promise<Types.UsersResponse>;
}
