/**
 * @title Blueberry Ring Swagger
 * @description ring api
 * @swagger 3.0.0
 * @version 1.0.0
 */

export interface NumericResponse {
  data: number;
}
export interface DiagnosisBody {
  method: string;
  date: string;
  from: string;
  lang: string;
  signature: string;
  prompt: number;
}
export interface DiagnosisResponse {
  data: string;
}
export interface AgentMessageBody {
  method: string;
  from: string;
  to: string;
}
export interface AgentMessageResponse {
  data: string;
}
export interface MemberData {
  season: number;
  device: number;
  score: number;
  rank: number;
  address: string;
  nickname: string;
  avatar: string;
}
export interface Season {
  id: number;
  group: number;
  rank: number;
  score: number;
  locked: string;
  timestamp: string;
}
export interface MembersResponse {
  data: MemberData[];
  total: number;
}
export interface OrderCreateBody {
  name: string;
  email: string;
  region: string;
  phone: string;
  address: string;
  size: number;
  invitation: string;
}
export interface Order {
  id: number;
  variable: number;
  payment: number;
  product: number;
  secret: string;
}
export interface OrderConfirmBody {
  secret: string;
  paymentIntent: string;
}
export interface AgentTransactionBody {
  method: string;
  from: string;
  to: string;
  data: string;
  signature: string;
}
export interface AgentTransactionResponse {
  _type: string;
  chainId: string;
  data: string;
  from: string;
  to: string;
  gasLimit: string;
  gasPrice: string;
  hash: string;
  value: string;
}
export interface Member {
  owner: string;
  score: number;
  group: string;
  sncode: number;
  token: string;
  tokenId: number;
  avatar: string;
  nickname: string;
  updateAt: string;
  pointInBasic: number;
  pointInJsons: string;
  bonusInToken: number;
  bonusIsGroup: number;
  invited: number;
  wearing: number;
}
export interface MemberPageResponse {
  total: number;
  data: Member[];
}
export interface TokenPageResponse {
  total: number;
  data: Group[];
}
export interface Group {
  id: number;
  description: string;
  creator: string;
  score: number;
  attributes: string[];
  name: string;
  image: string;
  country: string;
  city: string;
  state: string;
  members: number;
  timestamp: string;
  invite: string;
  opening: boolean;
  hexagon: string;
}
export interface BooleanResponse {
  data: boolean;
}
export interface ConditionsResponse {
  wearing: boolean;
  steps: boolean;
  balance: boolean;
  health: boolean;
  whitelist: boolean;
  invited: boolean;
}
export interface RingDataStep {
  date: number;
  value: number;
  token: string;
  tokenId: number;
  kcal: number;
  km: number;
}
export interface RingData {
  date: number;
  value: number;
  token: string;
  tokenId: number;
}
export interface DataPacketResponse {
  data: RingData[];
  total: number;
}
export interface User {
  owner: string;
  score: number;
  group: string;
  sncode: number;
  token: string;
  tokenId: number;
  avatar: string;
  nickname: string;
  updateAt: string;
  pointInBasic: number;
  pointInJsons: string;
  bonusInToken: number;
  bonusIsGroup: number;
  invited: number;
}
export interface UserResponse {
  data?: User;
}
export interface Reward {
  token: string;
  amount: string;
}
export interface ClaimIntelResponse {
  claimed: number;
  claims: number;
  sncode: string;
  amount: string;
  level: number;
  uid: string;
  day: string;
}
export interface ClaimSignatureResponse {
  uid: string;
  signature: string;
  rewards: Reward[];
}
export interface SignatureResponse {
  data: string;
}
export interface UsersResponse {
  total: number;
  data: User[];
}
export interface GetEstimateBonusStakeQuery {
  owner: string;
}
export interface GetSeasonQuery {
  group: number;
  date: string;
}
export interface GetSeasonMembersQuery {
  season: number;
}
export interface GetGroupDetailIdPath {
  id: number;
}
export interface GetGroupInviteInPath {
  in: string;
}
export interface GetGroupQuery {
  countryCode?: string;
  score?: string;
  members?: string;
  keyword: string;
}
export interface GetGroupDetailIdMembersPath {
  id: number;
}
export interface GetGroupDetailIdMembersQuery {
  limit?: number;
  page: number;
}
export interface GetGroupConditionQuery {
  type: string;
  address: string;
}
export interface GetGroupConditionsQuery {
  address: string;
}
export interface GetRingSleepsQuery {
  sncode: string;
  date?: number;
}
export interface GetRingOxygensQuery {
  sncode: string;
  date?: number;
}
export interface GetRingRatesQuery {
  sncode: string;
  date?: number;
}
export interface GetRingStepsQuery {
  sncode: string;
  date?: number;
}
export interface GetRingStepsTotalQuery {
  sncode: string;
}
export interface GetRingWearingQuery {
  sncode: string;
}
export interface GetRingClaimedHashPath {
  hash: string;
}
export interface GetUserAddressPath {
  address: string;
}
export interface GetUserScoreTotalQuery {
  group: number;
}
export interface GetSignClaimIntelQuery {
  sender: string;
}
export interface GetSignClaimQuery {
  sender: string;
}
export interface PostSignClaimCountQuery {
  uid: string;
}
export interface GetSignGroupClaimQuery {
  sender: string;
  group: number;
}
export interface GetSignGroupCreateQuery {
  sender: string;
  uri: string;
}
export interface GetSignGroupJoinQuery {
  sender: string;
  invite?: string;
  group?: number;
}
export interface GetRankGroupQuery {
  owner: string;
}
