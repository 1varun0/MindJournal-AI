import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerUserProfile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly owner?: string | null;
  readonly name?: string | null;
  readonly email: string;
  readonly joinDate: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserProfile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly owner?: string | null;
  readonly name?: string | null;
  readonly email: string;
  readonly joinDate: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserProfile = LazyLoading extends LazyLoadingDisabled ? EagerUserProfile : LazyUserProfile

export declare const UserProfile: (new (init: ModelInit<UserProfile>) => UserProfile) & {
  copyOf(source: UserProfile, mutator: (draft: MutableModel<UserProfile>) => MutableModel<UserProfile> | void): UserProfile;
}

type EagerEntry = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Entry, 'id'>;
  };
  readonly id: string;
  readonly content: string;
  readonly moodScore?: number | null;
  readonly anxietyScore?: number | null;
  readonly detectedEmotions?: string | null;
  readonly energyLevel?: string | null;
  readonly aiInsight?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyEntry = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Entry, 'id'>;
  };
  readonly id: string;
  readonly content: string;
  readonly moodScore?: number | null;
  readonly anxietyScore?: number | null;
  readonly detectedEmotions?: string | null;
  readonly energyLevel?: string | null;
  readonly aiInsight?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type Entry = LazyLoading extends LazyLoadingDisabled ? EagerEntry : LazyEntry

export declare const Entry: (new (init: ModelInit<Entry>) => Entry) & {
  copyOf(source: Entry, mutator: (draft: MutableModel<Entry>) => MutableModel<Entry> | void): Entry;
}