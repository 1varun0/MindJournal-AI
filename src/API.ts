/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserProfileInput = {
  id?: string | null,
  owner?: string | null,
  name?: string | null,
  email: string,
  joinDate: string,
  weeklyConsistency?: number | null,
  totalEntries?: number | null,
  insightsGenerated?: number | null,
  goalsCompleted?: number | null,
  currentWeeklyFocus?: string | null,
  weeklyFocusProgress?: number | null,
  lastLogin?: string | null,
  preferences?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelUserProfileConditionInput = {
  owner?: ModelStringInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  joinDate?: ModelStringInput | null,
  weeklyConsistency?: ModelIntInput | null,
  totalEntries?: ModelIntInput | null,
  insightsGenerated?: ModelIntInput | null,
  goalsCompleted?: ModelIntInput | null,
  currentWeeklyFocus?: ModelStringInput | null,
  weeklyFocusProgress?: ModelIntInput | null,
  lastLogin?: ModelStringInput | null,
  preferences?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserProfileConditionInput | null > | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  not?: ModelUserProfileConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  id: string,
  owner?: string | null,
  name?: string | null,
  email: string,
  joinDate: string,
  weeklyConsistency?: number | null,
  totalEntries?: number | null,
  insightsGenerated?: number | null,
  goalsCompleted?: number | null,
  currentWeeklyFocus?: string | null,
  weeklyFocusProgress?: number | null,
  lastLogin?: string | null,
  preferences?: string | null,
  createdAt: string,
  updatedAt: string,
  entries?: ModelEntryConnection | null,
};

export type ModelEntryConnection = {
  __typename: "ModelEntryConnection",
  items:  Array<Entry | null >,
  nextToken?: string | null,
};

export type Entry = {
  energyScore: null;
  __typename: "Entry",
  id: string,
  content: string,
  moodScore?: number | null,
  anxietyScore?: number | null,
  stressScore?: number | null,
  detectedEmotions?: Array< string | null > | null,
  detectedTriggers?: Array< string | null > | null,
  energyLevel?: string | null,
  sleepQuality?: number | null,
  aiInsight?: string | null,
  moodCategory?: string | null,
  tags?: Array< string | null > | null,
  isFavorite?: boolean | null,
  location?: string | null,
  weather?: string | null,
  goalsCompleted?: Array< string | null > | null,
  exerciseCompleted?: boolean | null,
  weeklyFocusProgress?: number | null,
  createdAt: string,
  updatedAt: string,
  userProfile?: UserProfile | null,
  userProfileEntriesId?: string | null,
  owner?: string | null,
};

export type UpdateUserProfileInput = {
  id: string,
  owner?: string | null,
  name?: string | null,
  email?: string | null,
  joinDate?: string | null,
  weeklyConsistency?: number | null,
  totalEntries?: number | null,
  insightsGenerated?: number | null,
  goalsCompleted?: number | null,
  currentWeeklyFocus?: string | null,
  weeklyFocusProgress?: number | null,
  lastLogin?: string | null,
  preferences?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type CreateEntryInput = {
  id?: string | null,
  content: string,
  moodScore?: number | null,
  anxietyScore?: number | null,
  stressScore?: number | null,
  detectedEmotions?: Array< string | null > | null,
  detectedTriggers?: Array< string | null > | null,
  energyLevel?: string | null,
  sleepQuality?: number | null,
  aiInsight?: string | null,
  moodCategory?: string | null,
  tags?: Array< string | null > | null,
  isFavorite?: boolean | null,
  location?: string | null,
  weather?: string | null,
  goalsCompleted?: Array< string | null > | null,
  exerciseCompleted?: boolean | null,
  weeklyFocusProgress?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  userProfileEntriesId?: string | null,
};

export type ModelEntryConditionInput = {
  content?: ModelStringInput | null,
  moodScore?: ModelIntInput | null,
  anxietyScore?: ModelIntInput | null,
  stressScore?: ModelIntInput | null,
  detectedEmotions?: ModelStringInput | null,
  detectedTriggers?: ModelStringInput | null,
  energyLevel?: ModelStringInput | null,
  sleepQuality?: ModelIntInput | null,
  aiInsight?: ModelStringInput | null,
  moodCategory?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  isFavorite?: ModelBooleanInput | null,
  location?: ModelStringInput | null,
  weather?: ModelStringInput | null,
  goalsCompleted?: ModelStringInput | null,
  exerciseCompleted?: ModelBooleanInput | null,
  weeklyFocusProgress?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelEntryConditionInput | null > | null,
  or?: Array< ModelEntryConditionInput | null > | null,
  not?: ModelEntryConditionInput | null,
  userProfileEntriesId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateEntryInput = {
  id: string,
  content?: string | null,
  moodScore?: number | null,
  anxietyScore?: number | null,
  stressScore?: number | null,
  detectedEmotions?: Array< string | null > | null,
  detectedTriggers?: Array< string | null > | null,
  energyLevel?: string | null,
  sleepQuality?: number | null,
  aiInsight?: string | null,
  moodCategory?: string | null,
  tags?: Array< string | null > | null,
  isFavorite?: boolean | null,
  location?: string | null,
  weather?: string | null,
  goalsCompleted?: Array< string | null > | null,
  exerciseCompleted?: boolean | null,
  weeklyFocusProgress?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  userProfileEntriesId?: string | null,
};

export type DeleteEntryInput = {
  id: string,
};

export type ModelUserProfileFilterInput = {
  id?: ModelIDInput | null,
  owner?: ModelStringInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  joinDate?: ModelStringInput | null,
  weeklyConsistency?: ModelIntInput | null,
  totalEntries?: ModelIntInput | null,
  insightsGenerated?: ModelIntInput | null,
  goalsCompleted?: ModelIntInput | null,
  currentWeeklyFocus?: ModelStringInput | null,
  weeklyFocusProgress?: ModelIntInput | null,
  lastLogin?: ModelStringInput | null,
  preferences?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserProfileFilterInput | null > | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  not?: ModelUserProfileFilterInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelEntryFilterInput = {
  id?: ModelIDInput | null,
  content?: ModelStringInput | null,
  moodScore?: ModelIntInput | null,
  anxietyScore?: ModelIntInput | null,
  stressScore?: ModelIntInput | null,
  detectedEmotions?: ModelStringInput | null,
  detectedTriggers?: ModelStringInput | null,
  energyLevel?: ModelStringInput | null,
  sleepQuality?: ModelIntInput | null,
  aiInsight?: ModelStringInput | null,
  moodCategory?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  isFavorite?: ModelBooleanInput | null,
  location?: ModelStringInput | null,
  weather?: ModelStringInput | null,
  goalsCompleted?: ModelStringInput | null,
  exerciseCompleted?: ModelBooleanInput | null,
  weeklyFocusProgress?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelEntryFilterInput | null > | null,
  or?: Array< ModelEntryFilterInput | null > | null,
  not?: ModelEntryFilterInput | null,
  userProfileEntriesId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  joinDate?: ModelSubscriptionStringInput | null,
  weeklyConsistency?: ModelSubscriptionIntInput | null,
  totalEntries?: ModelSubscriptionIntInput | null,
  insightsGenerated?: ModelSubscriptionIntInput | null,
  goalsCompleted?: ModelSubscriptionIntInput | null,
  currentWeeklyFocus?: ModelSubscriptionStringInput | null,
  weeklyFocusProgress?: ModelSubscriptionIntInput | null,
  lastLogin?: ModelSubscriptionStringInput | null,
  preferences?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  userProfileEntriesId?: ModelSubscriptionIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionEntryFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  content?: ModelSubscriptionStringInput | null,
  moodScore?: ModelSubscriptionIntInput | null,
  anxietyScore?: ModelSubscriptionIntInput | null,
  stressScore?: ModelSubscriptionIntInput | null,
  detectedEmotions?: ModelSubscriptionStringInput | null,
  detectedTriggers?: ModelSubscriptionStringInput | null,
  energyLevel?: ModelSubscriptionStringInput | null,
  sleepQuality?: ModelSubscriptionIntInput | null,
  aiInsight?: ModelSubscriptionStringInput | null,
  moodCategory?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  isFavorite?: ModelSubscriptionBooleanInput | null,
  location?: ModelSubscriptionStringInput | null,
  weather?: ModelSubscriptionStringInput | null,
  goalsCompleted?: ModelSubscriptionStringInput | null,
  exerciseCompleted?: ModelSubscriptionBooleanInput | null,
  weeklyFocusProgress?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionEntryFilterInput | null > | null,
  or?: Array< ModelSubscriptionEntryFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type CreateUserProfileMutationVariables = {
  input: CreateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner?: string | null,
    name?: string | null,
    email: string,
    joinDate: string,
    weeklyConsistency?: number | null,
    totalEntries?: number | null,
    insightsGenerated?: number | null,
    goalsCompleted?: number | null,
    currentWeeklyFocus?: string | null,
    weeklyFocusProgress?: number | null,
    lastLogin?: string | null,
    preferences?: string | null,
    createdAt: string,
    updatedAt: string,
    entries?:  {
      __typename: "ModelEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  input: UpdateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner?: string | null,
    name?: string | null,
    email: string,
    joinDate: string,
    weeklyConsistency?: number | null,
    totalEntries?: number | null,
    insightsGenerated?: number | null,
    goalsCompleted?: number | null,
    currentWeeklyFocus?: string | null,
    weeklyFocusProgress?: number | null,
    lastLogin?: string | null,
    preferences?: string | null,
    createdAt: string,
    updatedAt: string,
    entries?:  {
      __typename: "ModelEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  input: DeleteUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner?: string | null,
    name?: string | null,
    email: string,
    joinDate: string,
    weeklyConsistency?: number | null,
    totalEntries?: number | null,
    insightsGenerated?: number | null,
    goalsCompleted?: number | null,
    currentWeeklyFocus?: string | null,
    weeklyFocusProgress?: number | null,
    lastLogin?: string | null,
    preferences?: string | null,
    createdAt: string,
    updatedAt: string,
    entries?:  {
      __typename: "ModelEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateEntryMutationVariables = {
  input: CreateEntryInput,
  condition?: ModelEntryConditionInput | null,
};

export type CreateEntryMutation = {
  createEntry?:  {
    __typename: "Entry",
    id: string,
    content: string,
    moodScore?: number | null,
    anxietyScore?: number | null,
    stressScore?: number | null,
    detectedEmotions?: Array< string | null > | null,
    detectedTriggers?: Array< string | null > | null,
    energyLevel?: string | null,
    sleepQuality?: number | null,
    aiInsight?: string | null,
    moodCategory?: string | null,
    tags?: Array< string | null > | null,
    isFavorite?: boolean | null,
    location?: string | null,
    weather?: string | null,
    goalsCompleted?: Array< string | null > | null,
    exerciseCompleted?: boolean | null,
    weeklyFocusProgress?: number | null,
    createdAt: string,
    updatedAt: string,
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userProfileEntriesId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateEntryMutationVariables = {
  input: UpdateEntryInput,
  condition?: ModelEntryConditionInput | null,
};

export type UpdateEntryMutation = {
  updateEntry?:  {
    __typename: "Entry",
    id: string,
    content: string,
    moodScore?: number | null,
    anxietyScore?: number | null,
    stressScore?: number | null,
    detectedEmotions?: Array< string | null > | null,
    detectedTriggers?: Array< string | null > | null,
    energyLevel?: string | null,
    sleepQuality?: number | null,
    aiInsight?: string | null,
    moodCategory?: string | null,
    tags?: Array< string | null > | null,
    isFavorite?: boolean | null,
    location?: string | null,
    weather?: string | null,
    goalsCompleted?: Array< string | null > | null,
    exerciseCompleted?: boolean | null,
    weeklyFocusProgress?: number | null,
    createdAt: string,
    updatedAt: string,
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userProfileEntriesId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteEntryMutationVariables = {
  input: DeleteEntryInput,
  condition?: ModelEntryConditionInput | null,
};

export type DeleteEntryMutation = {
  deleteEntry?:  {
    __typename: "Entry",
    id: string,
    content: string,
    moodScore?: number | null,
    anxietyScore?: number | null,
    stressScore?: number | null,
    detectedEmotions?: Array< string | null > | null,
    detectedTriggers?: Array< string | null > | null,
    energyLevel?: string | null,
    sleepQuality?: number | null,
    aiInsight?: string | null,
    moodCategory?: string | null,
    tags?: Array< string | null > | null,
    isFavorite?: boolean | null,
    location?: string | null,
    weather?: string | null,
    goalsCompleted?: Array< string | null > | null,
    exerciseCompleted?: boolean | null,
    weeklyFocusProgress?: number | null,
    createdAt: string,
    updatedAt: string,
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userProfileEntriesId?: string | null,
    owner?: string | null,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner?: string | null,
    name?: string | null,
    email: string,
    joinDate: string,
    weeklyConsistency?: number | null,
    totalEntries?: number | null,
    insightsGenerated?: number | null,
    goalsCompleted?: number | null,
    currentWeeklyFocus?: string | null,
    weeklyFocusProgress?: number | null,
    lastLogin?: string | null,
    preferences?: string | null,
    createdAt: string,
    updatedAt: string,
    entries?:  {
      __typename: "ModelEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetEntryQueryVariables = {
  id: string,
};

export type GetEntryQuery = {
  getEntry?:  {
    __typename: "Entry",
    id: string,
    content: string,
    moodScore?: number | null,
    anxietyScore?: number | null,
    stressScore?: number | null,
    detectedEmotions?: Array< string | null > | null,
    detectedTriggers?: Array< string | null > | null,
    energyLevel?: string | null,
    sleepQuality?: number | null,
    aiInsight?: string | null,
    moodCategory?: string | null,
    tags?: Array< string | null > | null,
    isFavorite?: boolean | null,
    location?: string | null,
    weather?: string | null,
    goalsCompleted?: Array< string | null > | null,
    exerciseCompleted?: boolean | null,
    weeklyFocusProgress?: number | null,
    createdAt: string,
    updatedAt: string,
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userProfileEntriesId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListEntriesQueryVariables = {
  filter?: ModelEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEntriesQuery = {
  listEntries?:  {
    __typename: "ModelEntryConnection",
    items:  Array< {
      __typename: "Entry",
      id: string,
      content: string,
      moodScore?: number | null,
      anxietyScore?: number | null,
      stressScore?: number | null,
      detectedEmotions?: Array< string | null > | null,
      detectedTriggers?: Array< string | null > | null,
      energyLevel?: string | null,
      sleepQuality?: number | null,
      aiInsight?: string | null,
      moodCategory?: string | null,
      tags?: Array< string | null > | null,
      isFavorite?: boolean | null,
      location?: string | null,
      weather?: string | null,
      goalsCompleted?: Array< string | null > | null,
      exerciseCompleted?: boolean | null,
      weeklyFocusProgress?: number | null,
      createdAt: string,
      updatedAt: string,
      userProfileEntriesId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner?: string | null,
    name?: string | null,
    email: string,
    joinDate: string,
    weeklyConsistency?: number | null,
    totalEntries?: number | null,
    insightsGenerated?: number | null,
    goalsCompleted?: number | null,
    currentWeeklyFocus?: string | null,
    weeklyFocusProgress?: number | null,
    lastLogin?: string | null,
    preferences?: string | null,
    createdAt: string,
    updatedAt: string,
    entries?:  {
      __typename: "ModelEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner?: string | null,
    name?: string | null,
    email: string,
    joinDate: string,
    weeklyConsistency?: number | null,
    totalEntries?: number | null,
    insightsGenerated?: number | null,
    goalsCompleted?: number | null,
    currentWeeklyFocus?: string | null,
    weeklyFocusProgress?: number | null,
    lastLogin?: string | null,
    preferences?: string | null,
    createdAt: string,
    updatedAt: string,
    entries?:  {
      __typename: "ModelEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner?: string | null,
    name?: string | null,
    email: string,
    joinDate: string,
    weeklyConsistency?: number | null,
    totalEntries?: number | null,
    insightsGenerated?: number | null,
    goalsCompleted?: number | null,
    currentWeeklyFocus?: string | null,
    weeklyFocusProgress?: number | null,
    lastLogin?: string | null,
    preferences?: string | null,
    createdAt: string,
    updatedAt: string,
    entries?:  {
      __typename: "ModelEntryConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnCreateEntrySubscriptionVariables = {
  filter?: ModelSubscriptionEntryFilterInput | null,
  owner?: string | null,
};

export type OnCreateEntrySubscription = {
  onCreateEntry?:  {
    __typename: "Entry",
    id: string,
    content: string,
    moodScore?: number | null,
    anxietyScore?: number | null,
    stressScore?: number | null,
    detectedEmotions?: Array< string | null > | null,
    detectedTriggers?: Array< string | null > | null,
    energyLevel?: string | null,
    sleepQuality?: number | null,
    aiInsight?: string | null,
    moodCategory?: string | null,
    tags?: Array< string | null > | null,
    isFavorite?: boolean | null,
    location?: string | null,
    weather?: string | null,
    goalsCompleted?: Array< string | null > | null,
    exerciseCompleted?: boolean | null,
    weeklyFocusProgress?: number | null,
    createdAt: string,
    updatedAt: string,
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userProfileEntriesId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateEntrySubscriptionVariables = {
  filter?: ModelSubscriptionEntryFilterInput | null,
  owner?: string | null,
};

export type OnUpdateEntrySubscription = {
  onUpdateEntry?:  {
    __typename: "Entry",
    id: string,
    content: string,
    moodScore?: number | null,
    anxietyScore?: number | null,
    stressScore?: number | null,
    detectedEmotions?: Array< string | null > | null,
    detectedTriggers?: Array< string | null > | null,
    energyLevel?: string | null,
    sleepQuality?: number | null,
    aiInsight?: string | null,
    moodCategory?: string | null,
    tags?: Array< string | null > | null,
    isFavorite?: boolean | null,
    location?: string | null,
    weather?: string | null,
    goalsCompleted?: Array< string | null > | null,
    exerciseCompleted?: boolean | null,
    weeklyFocusProgress?: number | null,
    createdAt: string,
    updatedAt: string,
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userProfileEntriesId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteEntrySubscriptionVariables = {
  filter?: ModelSubscriptionEntryFilterInput | null,
  owner?: string | null,
};

export type OnDeleteEntrySubscription = {
  onDeleteEntry?:  {
    __typename: "Entry",
    id: string,
    content: string,
    moodScore?: number | null,
    anxietyScore?: number | null,
    stressScore?: number | null,
    detectedEmotions?: Array< string | null > | null,
    detectedTriggers?: Array< string | null > | null,
    energyLevel?: string | null,
    sleepQuality?: number | null,
    aiInsight?: string | null,
    moodCategory?: string | null,
    tags?: Array< string | null > | null,
    isFavorite?: boolean | null,
    location?: string | null,
    weather?: string | null,
    goalsCompleted?: Array< string | null > | null,
    exerciseCompleted?: boolean | null,
    weeklyFocusProgress?: number | null,
    createdAt: string,
    updatedAt: string,
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      owner?: string | null,
      name?: string | null,
      email: string,
      joinDate: string,
      weeklyConsistency?: number | null,
      totalEntries?: number | null,
      insightsGenerated?: number | null,
      goalsCompleted?: number | null,
      currentWeeklyFocus?: string | null,
      weeklyFocusProgress?: number | null,
      lastLogin?: string | null,
      preferences?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    userProfileEntriesId?: string | null,
    owner?: string | null,
  } | null,
};
