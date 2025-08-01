import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { useAccount } from '../hooks/useAccount';

const ProfileSettings: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { user, loading, error, locationOptions, formData, setFormData, updateAccountData } = useAccount();

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <ProgressSpinner />
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <i className="pi pi-exclamation-triangle text-4xl text-red-500 mb-4"></i>
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

  const handleInputChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = () => {
    updateAccountData(formData);
    setFormData((prev) => ({ ...prev, ...formData }));
    console.log('Profile updated', formData);
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully!',
      life: 3000
    });
  };

  const handlePasswordSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match!',
        life: 3000
      });
      return;
    }
    updateAccountData(formData);
    console.log('Password updated', formData);
    setFormData((prev) => ({
      ...prev,
      currentPassword: '',
      password: '',
      confirmPassword: '',
    }));
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Password updated successfully!',
      life: 3000
    });
    setFormData((prev) => ({
      ...prev,
      currentPassword: '',
      password: '',
      confirmPassword: '',
    }));
  };

  return (
    <div className="min-h-screen p-6">
      <Toast ref={toast} />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome, {user?.name}! Manage your account information and security settings.
          </p>
        </div>

        <div>
          <TabView>
            <TabPanel header="Profile Information">
              <div className="space-y-6">
                <div className="field">
                  <label htmlFor="name" className="font-bold">Name</label>
                  <InputText
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="field">
                  <label htmlFor="email" className="font-bold">Email</label>
                  <InputText
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="field">
                  <label htmlFor="location" className="font-bold">Location</label>
                  <Dropdown
                    id="location"
                    value={formData.location}
                    options={locationOptions}
                    onChange={(e) => handleInputChange('location', e.value)}
                    placeholder="Select your location"
                    filter
                    showClear
                    className="w-full"
                  />
                </div>

                <div className="field">
                  <label htmlFor="notificationThreshold" className="font-bold">Notification Threshold (Risk Level)</label>
                  <InputNumber
                    id="notificationThreshold"
                    value={formData.notificationThreshold}
                    onValueChange={(e) => handleInputChange('notificationThreshold', e.value || 50)}
                    min={1}
                    max={100}
                    showButtons
                    className="w-full"
                    suffix=" %"
                  />
                  <small className="text-gray-600">Receive notifications when risk levels exceed this threshold</small>
                </div>

                <div className="field-checkbox">
                  <Checkbox
                    inputId="receiveEmailNotifications"
                    checked={formData.receiveEmailNotifications}
                    onChange={(e) => handleInputChange('receiveEmailNotifications', e.checked as boolean)}
                  />
                  <label htmlFor="receiveEmailNotifications" className="ml-2 font-bold">Opt-in for email notifications about your country's risk updates</label>
                </div>

                <div className="flex justify-end">
                  <Button
                    label="Save Changes"
                    icon="pi pi-check"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Security">
              <div className="space-y-6">
                <div className="field">
                  <label htmlFor="currentPassword" className="font-bold">Current Password</label>
                  <InputText
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    className="w-full"
                    disabled
                    type="password"
                  />
                </div>

                <div className="field">
                  <label htmlFor="password" className="font-bold">New Password</label>
                  <InputText
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter new password"
                    className="w-full"
                    type="password"
                  />
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword" className="font-bold">Confirm New Password</label>
                  <InputText
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full"
                    type="password"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    label="Update Password"
                    icon="pi pi-shield"
                    onClick={handlePasswordSubmit}
                    severity="warning"
                  />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
