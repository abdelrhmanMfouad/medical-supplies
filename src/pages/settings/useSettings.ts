import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  clearError,
  clearSuccessMessage,
} from './settingsSlice';
import {
  UpdateProfileData,
  PasswordUpdateData,
} from './settings.types';

export const useSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    profile,
    isLoading,
    error,
    successMessage,
  } = useSelector((state: RootState) => state.settings);

  // ✅ loadProfile - عشان يجيب الـ Profile
  const loadProfile = useCallback(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // ✅ Fetch profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdateProfile = useCallback(
    async (data: UpdateProfileData) => {
      console.log('📝 Updating profile with data:', data);
      const result = await dispatch(updateProfile(data)).unwrap();
      console.log('✅ Profile update result:', result);
      return result;
    },
    [dispatch]
  );

  const handleUpdatePassword = useCallback(
    async (data: PasswordUpdateData) => {
      console.log('🔑 Updating password');
      const result = await dispatch(updatePassword(data)).unwrap();
      console.log('✅ Password update result:', result);
      return result;
    },
    [dispatch]
  );

  const handleUploadAvatar = useCallback(
    async (file: File) => {
      const result = await dispatch(uploadAvatar(file)).unwrap();
      return result;
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSuccessMessage = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  return {
    profile,
    isLoading,
    error,
    successMessage,
    loadProfile,  // ✅ أضف
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
    uploadAvatar: handleUploadAvatar,
    clearError: handleClearError,
    clearSuccessMessage: handleClearSuccessMessage,
  };
};