import { Add, DeleteForever } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    TextField
} from '@mui/material';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import {
    useCompleteTodoMutation,
    useCreateTodoMutation,
    useDeleteTodoMutation,
    useListTodosQuery,
    useUncompleteTodoMutation
} from '../graphql/types';

import { DefaultLayout } from './DefaultLayout';

export const Home = (): React.ReactElement => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [description, setDescription] = useState('');
    const { data, isLoading, refetch } = useListTodosQuery();
    const createTodoMutation = useCreateTodoMutation();
    const completeTodoMutation = useCompleteTodoMutation();
    const deleteTodoMutation = useDeleteTodoMutation();
    const uncompleteTodoMutation = useUncompleteTodoMutation();

    const isValidDescription = () => description.length > 1;

    const createTodo = async () => {
        if (isValidDescription()) {
            await createTodoMutation.mutateAsync({ description });
            enqueueSnackbar('Todo successfully created', { variant: 'success' });
            await refetch();
            setDescription('');
        }
    };

    const deleteTodo = async (todoId: string) => {
        await deleteTodoMutation.mutateAsync({ todoId });
        enqueueSnackbar('Todo successfully deleted', { variant: 'success' });
        await refetch();
    };

    const handleCompletion = async (todoId: string) => {
        const todo = data?.todos.find((todo) => todo.id === todoId);
        if (todo?.isCompleted) {
            await uncomplete(todoId);
        } else {
            await complete(todoId);
        }
    };

    const complete = async (todoId: string) => {
        await completeTodoMutation.mutateAsync({ todoId });
        await refetch();
        enqueueSnackbar('Todo successfully completed', {
            variant: 'success',
            action: (key) => (
                <Button
                    color='inherit'
                    onClick={async () => {
                        closeSnackbar(key);
                        await uncomplete(todoId);
                    }}
                >
                    undo
                </Button>
            )
        });
    };

    const uncomplete = async (todoId: string) => {
        await uncompleteTodoMutation.mutateAsync({ todoId });
        await refetch();
        enqueueSnackbar('Todo successfully uncompleted', {
            variant: 'success',
            action: (key) => (
                <Button
                    color='inherit'
                    onClick={async () => {
                        closeSnackbar(key);
                        await complete(todoId);
                    }}
                >
                    undo
                </Button>
            )
        });
    };

    return (
        <DefaultLayout>
            <Grid item xs={12}>
                <Stack direction='column' spacing={2} justifyItems='center' justifyContent='center'>
                    <Card>
                        <CardContent>
                            <Stack direction='column' spacing={2} justifyItems='center' justifyContent='center'>
                                <TextField
                                    variant='outlined'
                                    fullWidth
                                    label='What needs to be done?'
                                    value={description}
                                    error={description.length > 0 && !isValidDescription()}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <LoadingButton
                                    startIcon={<Add />}
                                    variant='contained'
                                    disabled={!isValidDescription()}
                                    onClick={async () => await createTodo()}
                                    loadingPosition='center'
                                    loading={isLoading}
                                >
                                    save
                                </LoadingButton>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {data?.todos.map((todo) => (
                                    <ListItem
                                        key={todo.id}
                                        disablePadding
                                        secondaryAction={
                                            <IconButton onClick={async () => await deleteTodo(todo.id)}>
                                                <DeleteForever />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemButton onClick={() => handleCompletion(todo.id)}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge='start'
                                                    checked={todo.isCompleted}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': todo.id }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                id={todo.id}
                                                primary={todo.description}
                                                secondary={`created ${moment(todo.timeline.createdAt).fromNow()}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
        </DefaultLayout>
    );
};
