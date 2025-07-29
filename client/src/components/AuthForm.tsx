import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { FloatLabel } from 'primereact/floatlabel';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export const AuthForm: React.FC = () => {
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const { control, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm<FormData>({
        defaultValues: {
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

            // --- Simulate an API Call ---
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Example of a simulated error for demonstration
            if (data.email === "error@example.com") {
                throw new Error("Invalid credentials provided.");
            }
            // --- End Simulation ---

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: isRegister ? 'Registration successful!' : 'Login successful!',
                life: 3000
            });
        } catch (error) {
            // This block will run if the API call fails
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage || (isRegister ? 'Registration failed.' : 'Login failed.'),
                life: 3000
            });
        }
    };

    const header = (
        <h2 className="text-center">{isRegister ? 'Register' : 'Login'}</h2>
    );

    const footer = (
        <div className="flex flex-column gap-3">
            <Button
                label={isRegister ? 'Register' : 'Login'}
                type="submit"
                loading={isSubmitting}
            />
            <Button
                label={isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                className="p-button-text"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    setIsRegister(!isRegister);
                    reset();
                }}
            />
        </div>
    );

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Toast ref={toast} />
            <Card title={header} footer={footer} className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid flex flex-column gap-4">
                    {/* Email Input */}
                    <FloatLabel>
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
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                />
                            )}
                        />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                    {getFormErrorMessage('email')}

                    {/* Password Input */}
                    <FloatLabel>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: 'Password is required.' }}
                            render={({ field, fieldState }) => (
                                <Password 
                                    id={field.name} 
                                    {...field} 
                                    toggleMask 
                                    feedback={isRegister} 
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                />
                            )}
                        />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>
                    {getFormErrorMessage('password')}

                    {/* Confirm Password Input (only in register mode) */}
                    {isRegister && (
                        <>
                            <FloatLabel>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        required: 'Password confirmation is required.',
                                        validate: (value: string) => value === password_watch || 'The passwords do not match.'
                                    }}
                                    render={({ field, fieldState }) => (
                                        <Password 
                                            id={field.name} 
                                            {...field} 
                                            toggleMask 
                                            className={classNames({ 'p-invalid': fieldState.error })} 
                                        />
                                    )}
                                />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                            </FloatLabel>
                            {getFormErrorMessage('confirmPassword')}
                        </>
                    )}
                </form>
            </Card>
        </div>
    );
};