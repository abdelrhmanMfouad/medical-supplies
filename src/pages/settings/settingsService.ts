import api from '../../services/api';
import { 
  UserProfile, 
  UpdateProfileData, 
  PasswordUpdateData,
} from './settings.types';

export const settingsService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  updatePassword: async (data: PasswordUpdateData): Promise<{ message: string }> => {
    const response = await api.put('/auth/change-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response = await api.post('/auth/upload-avatar', { avatar: base64 });
    return { avatarUrl: response.data.avatar };
  },
};