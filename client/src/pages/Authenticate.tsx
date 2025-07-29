import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

// Authentication
import { useAuth } from '../hooks/useAuth';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function Authenticate() {
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const { login } = useAuth();

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

            // make use of auth provider for login or registration
            if (isRegister) {
                // Registration logic here
                // For example, you might want to call an API endpoint to register the user
                // await register(data.email, data.password);
            } else {
                // Login logic here
                try {
                  await login(data.email, data.password);
                } catch (error) {
                  console.error('Login failed:', error);
                  throw new Error('Login failed. Please check your credentials.');
                }
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: isRegister ? 'Registration successful!' : 'Login successful!',
                life: 3000
            });

            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage || (isRegister ? 'Registration failed.' : 'Login failed.'),
                life: 3000
            });
        }
    };

    return (
        <div className="flex items-center justify-center w-screen bg-white h-screen">
            <Toast ref={toast} />
            <div className="flex flex-col gap-4 max-w-md w-full">
              <h2 className="text-center text-black text-2xl">{isRegister ? 'Register' : 'Login'}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
                      rules={{ required: 'Password is required.' }}
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
              </form>
              <div className="flex flex-col gap-4 justify-center">
                  <Button
                      label={isRegister ? 'Register' : 'Login'}
                      type="submit"
                      loading={isSubmitting}
                      onClick={handleSubmit(onSubmit)}
                  />
                  <div className="text-center text-black cursor-pointer">
                    {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                    <span
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.preventDefault();
                          setIsRegister(!isRegister);
                          reset();
                      }}
                      className="underline"
                    >
                        {isRegister ? 'Login' : "Register"}
                    </span>
                  </div>
              </div>
            </div>
        </div>
    );
};