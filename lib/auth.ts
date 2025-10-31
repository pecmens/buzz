import { supabase } from './supabase';

// 用户类型定义
export type User = {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
};

// 用户登录函数
export async function login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }

    // 更新用户最后登录时间
    if (data.user) {
      await updateLastLogin(data.user.id);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// 用户注册函数
export async function register(email: string, password: string, username?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      console.error('Registration error:', error);
      throw new Error(error.message);
    }

    // 如果需要在users表中创建用户记录
    if (data.user && !error) {
      await createUserProfile(data.user.id, email, username);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// 获取当前登录用户
export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// 获取用户资料
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get user profile error:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}

// 更新用户资料
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update user profile error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
}

// 用户登出
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// 第三方登录 - GitHub
export async function loginWithGitHub() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error('GitHub login error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
}

// 第三方登录 - Google
export async function loginWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Google login error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

// 发送密码重置邮件
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

// 创建用户资料
async function createUserProfile(userId: string, email: string, username?: string) {
  try {
    const { error } = await supabase.from('users').insert({
      id: userId,
      email,
      username: username || email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    });

    if (error) {
      console.error('Create user profile error:', error);
      // 静默处理，不影响主流程
    }
  } catch (error) {
    console.error('Create user profile error:', error);
  }
}

// 更新用户最后登录时间
async function updateLastLogin(userId: string) {
  try {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('Update last login error:', error);
  }
}