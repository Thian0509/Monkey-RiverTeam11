import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

// Authentication
import { useAuth } from '../hooks/useAuth';

// Import your useNotifications hook
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
    // Get the addNotification function from your context
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
                // --- Registration Logic ---
                try {
                    await register(data.name, data.email, data.password);
                    // If register() succeeds, add a success notification
                    addNotification(`Welcome, ${data.name}! Your account has been successfully registered.`);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Registration Success',
                        detail: 'Your account has been created!',
                        life: 3000
                    });
                    reset(); // Clear form after successful registration
                    setIsRegister(false); // Optionally switch to login mode after register
                } catch (error: any) { // Catch the specific error from your register function
                    console.error('Registration failed:', error);
                    const errorMessage = error.message || 'Registration failed. Please try again.';
                    // Add a notification for registration failure
                    addNotification(`Registration failed for ${data.name}. ${errorMessage}`);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Registration Error',
                        detail: errorMessage,
                        life: 3000
                    });
                    return; // Stop execution if registration fails
                }
            } else {
                // --- Login Logic ---
                try {
                    await login(data.email, data.password);
                    // If login() succeeds, add a success notification
                    addNotification(`Welcome back, ${data.email.split('@')[0]}! You have successfully logged in.`);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Login Success',
                        detail: 'You are now logged in!',
                        life: 3000
                    });
                    reset(); // Clear form after successful login
                } catch (error: any) { // Catch the specific error from your login function
                    console.error('Login failed:', error);
                    const errorMessage = error.message || 'Login failed. Please check your credentials.';
                    // Add a notification for login failure
                    addNotification(`Login failed for ${data.email}. ${errorMessage}`);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Login Error',
                        detail: errorMessage,
                        life: 3000
                    });
                    return; // Stop execution if login fails
                }
            }

            // This part only runs if login/register was successful
            // Redirect to home page
            window.location.href = '/'; // Consider using useNavigate hook for better React Router integration
        } catch (globalError: any) { // Catch unexpected errors not caught by login/register functions
            // This catch block might be redundant if specific errors are handled above,
            // but good for truly unexpected issues.
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
            <Toast ref={toast} /> {/* This Toast is for immediate, temporary messages */}
            <div className="flex flex-col gap-4 max-w-md w-full"> {/* Added padding, border, shadow */}
                <h2 className="text-center text-black text-2xl">{isRegister ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4"> {/* Increased gap for better spacing */}
                    {/* Name Input (only for registration) */}
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
                                    placeholder="Name" // Placeholder is usually redundant with float label
                                />
                            )}
                        />
                    )}
                    {isRegister && getFormErrorMessage('name')}

                    {/* Email Input */}
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

                    {/* Password Input */}
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required.',
                            // Note: Password component often has its own internal validation/feedback
                            // This regex allows letters and numbers, min 8 chars
                            pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: 'Password must be at least 8 characters long and contain letters and numbers.' }
                        }}
                        render={({ field, fieldState }) => (
                            <InputText // Changed to InputText to match your original
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
                                    <InputText // Changed to InputText
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
                        type="submit" // Set type to submit for form submission
                        loading={isSubmitting}
                        className="mt-4" // Margin top for spacing
                    />
                </form>
                <div className="text-center text-black cursor-pointer mt-3"> {/* Added margin-top */}
                    {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                    <span
                        onClick={(e: React.MouseEvent<HTMLSpanElement>) => { // Changed type to HTMLSpanElement
                            e.preventDefault();
                            setIsRegister(!isRegister);
                            reset(); // Reset form fields when toggling mode
                        }}
                        className="underline text-blue-500 hover:text-blue-700" // Added blue color and hover
                    >
                        {isRegister ? 'Login' : "Register"}
                    </span>
                </div>
            </div>
        </div>
    );
}