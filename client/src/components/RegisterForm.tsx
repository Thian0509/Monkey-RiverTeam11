// src/components/RegisterForm.tsx

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

interface RegisterFormProps {
  onRegisterSubmit?: (email: string, password: string, confirmPassword: string) => void;
  onNavigateToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSubmit, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRegisterSubmit) {
      console.log('Register attempt:', { email, password, confirmPassword });
      onRegisterSubmit(email, password, confirmPassword);
    }
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
        <Button label="Register" icon="pi pi-user-plus" className="p-button-primary" onClick={handleSubmit}/>
        <Button label="Login" icon="pi pi-sign-in" className="p-button-text" onClick={onNavigateToLogin}/>
    </div>
  );

  return (
    <div className="flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card title="Register" footer={footer} className="md:w-25rem">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <span className="p-float-label">
              <InputText id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full"/>
              <label htmlFor="reg-email">Email</label>
            </span>
          </div>
          <div className="field mt-3">
            <span className="p-float-label">
              <Password id="reg-password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} className="w-full"/>
              <label htmlFor="reg-password">Password</label>
            </span>
          </div>
          <div className="field mt-3">
            <span className="p-float-label">
              <Password id="reg-confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask feedback={false} className="w-full"/>
              <label htmlFor="reg-confirm-password">Confirm Password</label>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;