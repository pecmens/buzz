import { supabase } from './supabase';
import { getCurrentUser } from './auth';

// 用户角色类型
export type UserRole = 'admin' | 'editor' | 'user';

// 权限检查结果类型
export interface PermissionResult {
  hasPermission: boolean;
  user?: any;
  role?: UserRole;
}

// 检查用户是否有管理权限
export async function checkAdminPermission(): Promise<PermissionResult> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { hasPermission: false };
    }

    // 从数据库获取用户角色信息
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error || !userProfile) {
      console.error('获取用户权限信息失败:', error);
      return { hasPermission: false, user };
    }

    const role = userProfile.role as UserRole;
    const hasPermission = role === 'admin' || role === 'editor';

    return {
      hasPermission,
      user,
      role
    };
  } catch (error) {
    console.error('权限检查失败:', error);
    return { hasPermission: false };
  }
}

// 检查用户是否是管理员
export async function isAdmin(): Promise<boolean> {
  const result = await checkAdminPermission();
  return result.hasPermission && result.role === 'admin';
}

// 检查用户是否是编辑者或管理员
export async function isEditor(): Promise<boolean> {
  const result = await checkAdminPermission();
  return result.hasPermission;
}

// 为用户设置管理员角色（仅用于初始化）
export async function setUserRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('设置用户角色失败:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('设置用户角色失败:', error);
    return false;
  }
}

// 获取用户角色
export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('获取用户角色失败:', error);
      return null;
    }

    return data.role as UserRole;
  } catch (error) {
    console.error('获取用户角色失败:', error);
    return null;
  }
}