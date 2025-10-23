/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onCreateUserProfile(filter: $filter, owner: $owner) {
    id
    owner
    name
    email
    joinDate
    weeklyConsistency
    totalEntries
    insightsGenerated
    goalsCompleted
    currentWeeklyFocus
    weeklyFocusProgress
    lastLogin
    preferences
    createdAt
    updatedAt
    entries {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onUpdateUserProfile(filter: $filter, owner: $owner) {
    id
    owner
    name
    email
    joinDate
    weeklyConsistency
    totalEntries
    insightsGenerated
    goalsCompleted
    currentWeeklyFocus
    weeklyFocusProgress
    lastLogin
    preferences
    createdAt
    updatedAt
    entries {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onDeleteUserProfile(filter: $filter, owner: $owner) {
    id
    owner
    name
    email
    joinDate
    weeklyConsistency
    totalEntries
    insightsGenerated
    goalsCompleted
    currentWeeklyFocus
    weeklyFocusProgress
    lastLogin
    preferences
    createdAt
    updatedAt
    entries {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onCreateEntry = /* GraphQL */ `subscription OnCreateEntry(
  $filter: ModelSubscriptionEntryFilterInput
  $owner: String
) {
  onCreateEntry(filter: $filter, owner: $owner) {
    id
    content
    moodScore
    anxietyScore
    stressScore
    detectedEmotions
    detectedTriggers
    energyLevel
    sleepQuality
    aiInsight
    moodCategory
    tags
    isFavorite
    location
    weather
    goalsCompleted
    exerciseCompleted
    weeklyFocusProgress
    createdAt
    updatedAt
    userProfile {
      id
      owner
      name
      email
      joinDate
      weeklyConsistency
      totalEntries
      insightsGenerated
      goalsCompleted
      currentWeeklyFocus
      weeklyFocusProgress
      lastLogin
      preferences
      createdAt
      updatedAt
      __typename
    }
    userProfileEntriesId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateEntrySubscriptionVariables,
  APITypes.OnCreateEntrySubscription
>;
export const onUpdateEntry = /* GraphQL */ `subscription OnUpdateEntry(
  $filter: ModelSubscriptionEntryFilterInput
  $owner: String
) {
  onUpdateEntry(filter: $filter, owner: $owner) {
    id
    content
    moodScore
    anxietyScore
    stressScore
    detectedEmotions
    detectedTriggers
    energyLevel
    sleepQuality
    aiInsight
    moodCategory
    tags
    isFavorite
    location
    weather
    goalsCompleted
    exerciseCompleted
    weeklyFocusProgress
    createdAt
    updatedAt
    userProfile {
      id
      owner
      name
      email
      joinDate
      weeklyConsistency
      totalEntries
      insightsGenerated
      goalsCompleted
      currentWeeklyFocus
      weeklyFocusProgress
      lastLogin
      preferences
      createdAt
      updatedAt
      __typename
    }
    userProfileEntriesId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateEntrySubscriptionVariables,
  APITypes.OnUpdateEntrySubscription
>;
export const onDeleteEntry = /* GraphQL */ `subscription OnDeleteEntry(
  $filter: ModelSubscriptionEntryFilterInput
  $owner: String
) {
  onDeleteEntry(filter: $filter, owner: $owner) {
    id
    content
    moodScore
    anxietyScore
    stressScore
    detectedEmotions
    detectedTriggers
    energyLevel
    sleepQuality
    aiInsight
    moodCategory
    tags
    isFavorite
    location
    weather
    goalsCompleted
    exerciseCompleted
    weeklyFocusProgress
    createdAt
    updatedAt
    userProfile {
      id
      owner
      name
      email
      joinDate
      weeklyConsistency
      totalEntries
      insightsGenerated
      goalsCompleted
      currentWeeklyFocus
      weeklyFocusProgress
      lastLogin
      preferences
      createdAt
      updatedAt
      __typename
    }
    userProfileEntriesId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteEntrySubscriptionVariables,
  APITypes.OnDeleteEntrySubscription
>;
