/* eslint-disable */
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
    return async (): Promise<TData> => {
        const res = await fetch('https://staging-api.todo.maikay.de/graphql', {
            method: 'POST',
            ...{ headers: { 'Content-Type': 'application/json' } },
            body: JSON.stringify({ query, variables })
        });

        const json = await res.json();

        if (json.errors) {
            const { message } = json.errors[0];

            throw new Error(message);
        }

        return json.data;
    };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    /** ISO-8601 encoded UTC date string. Example value: `"2022-01-01T13:37:01.337Z"` */
    DateTime: any;
};

export type CompleteInput = {
    todoId: Scalars['ID'];
};

export type CompleteOutput = {
    __typename?: 'CompleteOutput';
    error?: Maybe<CompleteOutputError>;
};

export enum CompleteOutputError {
    Internal = 'INTERNAL',
    TodoAlreadyCompleted = 'TODO_ALREADY_COMPLETED',
    TodoDoesNotExists = 'TODO_DOES_NOT_EXISTS'
}

export type CreateInput = {
    description: Scalars['String'];
};

export type CreateOutput = {
    __typename?: 'CreateOutput';
    error?: Maybe<CreateOutputError>;
};

export enum CreateOutputError {
    Internal = 'INTERNAL'
}

export type DeleteInput = {
    todoId: Scalars['ID'];
};

export type DeleteOutput = {
    __typename?: 'DeleteOutput';
    error?: Maybe<DeleteOutputError>;
};

export enum DeleteOutputError {
    Internal = 'INTERNAL',
    TodoDoesNotExists = 'TODO_DOES_NOT_EXISTS'
}

export type Mutation = {
    __typename?: 'Mutation';
    /** Complete todo */
    complete: CompleteOutput;
    /** Create new todo */
    create: CreateOutput;
    /** Delete todo */
    delete: DeleteOutput;
};

export type MutationCompleteArgs = {
    input: CompleteInput;
};

export type MutationCreateArgs = {
    input: CreateInput;
};

export type MutationDeleteArgs = {
    input: DeleteInput;
};

export type Query = {
    __typename?: 'Query';
    /** Get all todos */
    todos: Array<Todo>;
};

export type Timeline = {
    __typename?: 'Timeline';
    completedAt?: Maybe<Scalars['DateTime']>;
    createdAt: Scalars['DateTime'];
};

export type Todo = {
    __typename?: 'Todo';
    description: Scalars['String'];
    id: Scalars['ID'];
    isCompleted: Scalars['Boolean'];
    timeline: Timeline;
};

export type CreateTodoMutationVariables = Exact<{
    description: Scalars['String'];
}>;

export type CreateTodoMutation = {
    __typename?: 'Mutation';
    create: { __typename?: 'CreateOutput'; error?: CreateOutputError | null };
};

export type CompleteTodoMutationVariables = Exact<{
    todoId: Scalars['ID'];
}>;

export type CompleteTodoMutation = {
    __typename?: 'Mutation';
    complete: { __typename?: 'CompleteOutput'; error?: CompleteOutputError | null };
};

export type DeleteTodoMutationVariables = Exact<{
    todoId: Scalars['ID'];
}>;

export type DeleteTodoMutation = {
    __typename?: 'Mutation';
    delete: { __typename?: 'DeleteOutput'; error?: DeleteOutputError | null };
};

export type ListTodosQueryVariables = Exact<{ [key: string]: never }>;

export type ListTodosQuery = {
    __typename?: 'Query';
    todos: Array<{
        __typename?: 'Todo';
        id: string;
        description: string;
        isCompleted: boolean;
        timeline: { __typename?: 'Timeline'; createdAt: any; completedAt?: any | null };
    }>;
};

export const CreateTodoDocument = `
    mutation CreateTodo($description: String!) {
  create(input: {description: $description}) {
    error
  }
}
    `;
export const useCreateTodoMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<CreateTodoMutation, TError, CreateTodoMutationVariables, TContext>
) =>
    useMutation<CreateTodoMutation, TError, CreateTodoMutationVariables, TContext>(
        ['CreateTodo'],
        (variables?: CreateTodoMutationVariables) =>
            fetcher<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, variables)(),
        options
    );
export const CompleteTodoDocument = `
    mutation CompleteTodo($todoId: ID!) {
  complete(input: {todoId: $todoId}) {
    error
  }
}
    `;
export const useCompleteTodoMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<CompleteTodoMutation, TError, CompleteTodoMutationVariables, TContext>
) =>
    useMutation<CompleteTodoMutation, TError, CompleteTodoMutationVariables, TContext>(
        ['CompleteTodo'],
        (variables?: CompleteTodoMutationVariables) =>
            fetcher<CompleteTodoMutation, CompleteTodoMutationVariables>(CompleteTodoDocument, variables)(),
        options
    );
export const DeleteTodoDocument = `
    mutation DeleteTodo($todoId: ID!) {
  delete(input: {todoId: $todoId}) {
    error
  }
}
    `;
export const useDeleteTodoMutation = <TError = unknown, TContext = unknown>(
    options?: UseMutationOptions<DeleteTodoMutation, TError, DeleteTodoMutationVariables, TContext>
) =>
    useMutation<DeleteTodoMutation, TError, DeleteTodoMutationVariables, TContext>(
        ['DeleteTodo'],
        (variables?: DeleteTodoMutationVariables) =>
            fetcher<DeleteTodoMutation, DeleteTodoMutationVariables>(DeleteTodoDocument, variables)(),
        options
    );
export const ListTodosDocument = `
    query ListTodos {
  todos {
    id
    description
    isCompleted
    timeline {
      createdAt
      completedAt
    }
  }
}
    `;
export const useListTodosQuery = <TData = ListTodosQuery, TError = unknown>(
    variables?: ListTodosQueryVariables,
    options?: UseQueryOptions<ListTodosQuery, TError, TData>
) =>
    useQuery<ListTodosQuery, TError, TData>(
        variables === undefined ? ['ListTodos'] : ['ListTodos', variables],
        fetcher<ListTodosQuery, ListTodosQueryVariables>(ListTodosDocument, variables),
        options
    );
