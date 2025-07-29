// src/components/AuthForm.tsx
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { FloatLabel } from 'primereact/floatlabel';

export const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const toast = useRef(null);

    // UPDATED: Added 'reset' from useForm
    const { control, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password_watch = watch("password");

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    // UPDATED: Made onSubmit async to handle API calls and added try/catch for errors
    const onSubmit = async (data) => {
        try {
            console.log('Form data:', data);

            // --- Simulate an API Call ---
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Example of a simulated error for demonstration
            if (data.email === "error@example.com") {
                throw new Error("Invalid credentials provided.");
            }
            // --- End Simulation ---

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: isRegister ? 'Registration successful!' : 'Login successful!',
                life: 3000
            });
        } catch (error) {
            // This block will run if the API call fails
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || (isRegister ? 'Registration failed.' : 'Login failed.'),
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
                onClick={(e) => {
                    e.preventDefault();
                    setIsRegister(!isRegister);
                    reset(); // NEW: Reset form fields on toggle
                }}
            />
        </div>
    );

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Toast ref={toast} />
            <Card title={header} footer={footer} className="w-full max-w-md">
                {/* Note: The form and inputs remain the same */}
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
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
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
                                <Password id={field.name} {...field} toggleMask feedback={isRegister} className={classNames({ 'p-invalid': fieldState.error })} />
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
                                        validate: value => value === password_watch || 'The passwords do not match.'
                                    }}
                                    render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.error })} />
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