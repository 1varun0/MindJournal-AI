/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $input: CreateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  createUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $input: UpdateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  updateUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $input: DeleteUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  deleteUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const createEntry = /* GraphQL */ `mutation CreateEntry(
  $input: CreateEntryInput!
  $condition: ModelEntryConditionInput
) {
  createEntry(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateEntryMutationVariables,
  APITypes.CreateEntryMutation
>;
export const updateEntry = /* GraphQL */ `mutation UpdateEntry(
  $input: UpdateEntryInput!
  $condition: ModelEntryConditionInput
) {
  updateEntry(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateEntryMutationVariables,
  APITypes.UpdateEntryMutation
>;
export const deleteEntry = /* GraphQL */ `mutation DeleteEntry(
  $input: DeleteEntryInput!
  $condition: ModelEntryConditionInput
) {
  deleteEntry(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteEntryMutationVariables,
  APITypes.DeleteEntryMutation
>;
