import { TypedContractEvent, TypedEventLog } from '@harsta/client/dist/_typechain-contracts/common'
import { BindedEvent, ClaimedEvent, RegisteredEvent } from '@harsta/client/dist/_typechain-contracts/contracts/DoitRingDevice'
import { GroupCreatedEvent, GroupJoinedEvent } from '@harsta/client/dist/_typechain-contracts/contracts/DoitRingFriend'
import { StorageUpdatedEvent } from '@harsta/client/dist/_typechain-contracts/contracts/Storage'

export type TypedContrEvent<
  InputTuple extends Array<any> = any,
  OutputTuple extends Array<any> = any,
  OutputObject = any,
> = TypedEventLog<TypedContractEvent<InputTuple, OutputTuple, OutputObject>>

export interface Events {
  Registered: TypedContrEvent<RegisteredEvent.InputTuple, RegisteredEvent.OutputTuple, RegisteredEvent.OutputObject>
  Claimed: TypedContrEvent<ClaimedEvent.InputTuple, ClaimedEvent.OutputTuple, ClaimedEvent.OutputObject>
  Binded: TypedContrEvent<BindedEvent.InputTuple, BindedEvent.OutputTuple, BindedEvent.OutputObject>
  GroupCreated: TypedContrEvent<GroupCreatedEvent.InputTuple, GroupCreatedEvent.OutputTuple, GroupCreatedEvent.OutputObject>
  GroupJoined: TypedContrEvent<GroupJoinedEvent.InputTuple, GroupJoinedEvent.OutputTuple, GroupJoinedEvent.OutputObject>
  StorageUpdated: TypedContrEvent<StorageUpdatedEvent.InputTuple, StorageUpdatedEvent.OutputTuple, StorageUpdatedEvent.OutputObject>
}
