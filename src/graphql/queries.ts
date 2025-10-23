/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
export const getEntry = /* GraphQL */ `query GetEntry($id: ID!) {
  getEntry(id: $id) {
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
` as GeneratedQuery<APITypes.GetEntryQueryVariables, APITypes.GetEntryQuery>;
export const listEntries = /* GraphQL */ `query ListEntries(
  $filter: ModelEntryFilterInput
  $limit: Int
  $nextToken: String
) {
  listEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      userProfileEntriesId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEntriesQueryVariables,
  APITypes.ListEntriesQuery
>;
