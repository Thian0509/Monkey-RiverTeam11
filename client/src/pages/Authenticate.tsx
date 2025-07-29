import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

// Hooks
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotification';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Authenticate() {
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const { login, register } = useAuth();
    const { addNotification } = useNotifications();

    const { control, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm<FormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password_watch = watch("password");

    const getFormErrorMessage = (name: keyof FormData) => {
        const error = errors[name] as FieldError | undefined;
        return error && <small className="p-error">{error.message}</small>;
    };

    const onSubmit = async (data: FormData) => {
        try {
            console.log('Form data:', data);

            if (isRegister) {
                try {
                    await register(data.name, data.email, data.password);
                    addNotification(`Welcome, ${data.name}! Your account has been successfully registered.`);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Registration Success',
                        detail: 'Your account has been created!',
                        life: 3000
                    });
                    reset();
                    setIsRegister(false);
                } catch (error) {
                    console.error('Registration failed:', error);
                    const errorMessage = error || 'Registration failed. Please try again.';
                    addNotification(`Registration failed for ${data.name}. ${errorMessage}`);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Registration Error',
                        detail: errorMessage as string,
                        life: 3000
                    });
                    return;
                }
            } else {
                try {
                    await login(data.email, data.password);
                    addNotification(`Welcome back, ${data.email.split('@')[0]}! You have successfully logged in.`);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Login Success',
                        detail: 'You are now logged in!',
                        life: 3000
                    });
                    reset();
                } catch (error) {
                    console.error('Login failed:', error);
                    const errorMessage = error || 'Login failed. Please check your credentials.';
                    addNotification(`Login failed for ${data.email}. ${errorMessage}`);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Login Error',
                        detail: errorMessage as string,
                        life: 3000
                    });
                    return;
                }
            }

            window.location.href = '/';
        } catch (globalError) {
            const errorMessage = globalError instanceof Error ? globalError.message : 'An unknown error occurred';
            addNotification(`An unexpected error occurred: ${errorMessage}`);
            toast.current?.show({
                severity: 'error',
                summary: 'Unexpected Error',
                detail: errorMessage,
                life: 3000
            });
        }
    };

    return (
        <div className="flex items-center justify-center w-screen bg-white h-screen">
            <Toast ref={toast} />
            <div className="flex flex-col gap-4 max-w-md w-full">
                <h2 className="text-center text-black text-2xl">{isRegister ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {isRegister && (
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required.' }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id={field.name}
                                    {...field}
                                    type="text"
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                    placeholder="Name"
                                />
                            )}
                        />
                    )}
                    {isRegister && getFormErrorMessage('name')}

                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required.',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address.' }
                        }}
                        render={({ field, fieldState }) => (
                            <InputText
                                id={field.name}
                                {...field}
                                type="email"
                                className={classNames({ 'p-invalid': fieldState.error })}
                                placeholder="Email"
                            />
                        )}
                    />
                    {getFormErrorMessage('email')}

                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required.',
                            pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: 'Password must be at least 8 characters long and contain letters and numbers.' }
                        }}
                        render={({ field, fieldState }) => (
                            <InputText
                                id={field.name}
                                {...field}
                                type="password"
                                className={classNames({ 'p-invalid': fieldState.error })}
                                placeholder="Password"
                            />
                        )}
                    />
                    {getFormErrorMessage('password')}

                    {isRegister && (
                        <>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: 'Password confirmation is required.',
                                    validate: (value: string) => value === password_watch || 'The passwords do not match.'
                                }}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        id={field.name}
                                        {...field}
                                        type="password"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        placeholder="Confirm Password"
                                    />
                                )}
                            />
                            {getFormErrorMessage('confirmPassword')}
                        </>
                    )}

                    <Button
                        label={isRegister ? 'Register' : 'Login'}
                        type="submit"
                        loading={isSubmitting}
                        className="mt-4"
                    />
                </form>
                <div className="text-center text-black cursor-pointer mt-3">
                    {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                    <span
                        onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                            e.preventDefault();
                            setIsRegister(!isRegister);
                            reset();
                        }}
                        className="underline text-blue-500 hover:text-blue-700"
                    >
                        {isRegister ? 'Login' : "Register"}
                    </span>
                </div>
            </div>
        </div>
    );
}