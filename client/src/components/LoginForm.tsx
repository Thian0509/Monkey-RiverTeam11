import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

interface LoginFormProps {
  onLoginSubmit?: (email: string, password: string) => void;
  onNavigateToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSubmit, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSubmit) {
      console.log('Login attempt:', { email, password });
      onLoginSubmit(email, password);
    }
  };

  const footer = (
    <div className="flex flex-wrap justify-content-end gap-2">
        <Button label="Login" icon="pi pi-sign-in" className="p-button-primary" onClick={handleSubmit}/>
        <Button label="Register" icon="pi pi-user-plus" className="p-button-text" onClick={onNavigateToRegister}/>
    </div>
  );

  return (
    <div className="flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card title="Login" footer={footer} className="md:w-25rem">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <span className="p-float-label">
              <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full"/>
              <label htmlFor="email">Email</label>
            </span>
          </div>
          <div className="field mt-3"> {/* Added margin-top for spacing */}
            <span className="p-float-label">
              <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} className="w-full"/>
              <label htmlFor="password">Password</label>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;