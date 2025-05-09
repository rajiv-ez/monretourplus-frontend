import React, { useState } from 'react';
import { Save, Mail, Bell } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Card from '../common/Card';
import toast from 'react-hot-toast';

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  senderEmail: string;
  senderName: string;
}

interface NotificationSettings {
  newComplaintNotification: boolean;
  complaintStatusChangeNotification: boolean;
  newFeedbackNotification: boolean;
  lowRatingAlerts: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
}

const Settings: React.FC = () => {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.msc-gabon.com',
    smtpPort: '587',
    smtpUser: 'notifications@msc-gabon.com',
    smtpPassword: '********',
    senderEmail: 'noreply@msc-gabon.com',
    senderName: 'MSC Gabon Notifications'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newComplaintNotification: true,
    complaintStatusChangeNotification: true,
    newFeedbackNotification: true,
    lowRatingAlerts: true,
    dailyDigest: false,
    weeklyReport: true
  });

  const handleEmailSettingsSave = () => {
    // Simulate API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Enregistrement des paramètres email...',
        success: 'Paramètres email mis à jour avec succès',
        error: 'Erreur lors de la mise à jour des paramètres'
      }
    );
  };

  const handleNotificationSettingsSave = () => {
    // Simulate API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Enregistrement des paramètres de notification...',
        success: 'Paramètres de notification mis à jour avec succès',
        error: 'Erreur lors de la mise à jour des paramètres'
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Configuration Email</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="smtpHost"
            name="smtpHost"
            label="Serveur SMTP"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
          />
          <Input
            id="smtpPort"
            name="smtpPort"
            label="Port SMTP"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
          />
          <Input
            id="smtpUser"
            name="smtpUser"
            label="Utilisateur SMTP"
            value={emailSettings.smtpUser}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
          />
          <Input
            id="smtpPassword"
            name="smtpPassword"
            label="Mot de passe SMTP"
            type="password"
            value={emailSettings.smtpPassword}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
          />
          <Input
            id="senderEmail"
            name="senderEmail"
            label="Email expéditeur"
            value={emailSettings.senderEmail}
            onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
          />
          <Input
            id="senderName"
            name="senderName"
            label="Nom expéditeur"
            value={emailSettings.senderName}
            onChange={(e) => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            onClick={handleEmailSettingsSave}
            icon={<Save className="h-5 w-5" />}
          >
            Enregistrer les paramètres email
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Paramètres de notification</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.newComplaintNotification}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  newComplaintNotification: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Nouvelle réclamation</span>
            </label>
            <span className="text-sm text-gray-500">
              Recevoir une notification pour chaque nouvelle réclamation
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.complaintStatusChangeNotification}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  complaintStatusChangeNotification: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Changement de statut des réclamations</span>
            </label>
            <span className="text-sm text-gray-500">
              Notification lors du changement de statut d'une réclamation
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.newFeedbackNotification}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  newFeedbackNotification: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Nouvel avis client</span>
            </label>
            <span className="text-sm text-gray-500">
              Recevoir une notification pour chaque nouvel avis
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.lowRatingAlerts}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  lowRatingAlerts: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Alertes notes basses</span>
            </label>
            <span className="text-sm text-gray-500">
              Alerte pour les avis avec une note inférieure à 3
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.dailyDigest}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  dailyDigest: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Résumé quotidien</span>
            </label>
            <span className="text-sm text-gray-500">
              Recevoir un résumé quotidien des activités
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notificationSettings.weeklyReport}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  weeklyReport: e.target.checked
                })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Rapport hebdomadaire</span>
            </label>
            <span className="text-sm text-gray-500">
              Recevoir un rapport détaillé chaque semaine
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            onClick={handleNotificationSettingsSave}
            icon={<Save className="h-5 w-5" />}
          >
            Enregistrer les paramètres de notification
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;