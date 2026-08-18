import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, ShieldCheck, UserCog, Trash2, Eye, EyeOff, Save, AlertTriangle } from "lucide-react";
import { AdminUser } from "./types";
import { useAdminUsers } from "@/store/adminStore";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  currentUserId: string;
}

export default function UsersTab({ currentUserId }: Props) {
  const { language, isEnglish } = useLanguage();
  const { users, addUser, deleteUser, updateUserPassword } = useAdminUsers();
  const [form, setForm] = useState({ username: "", password: "", role: "admin" as AdminUser["role"] });
  const [showPass, setShowPass] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [changingPassId, setChangingPassId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // ============================================
  // 📝 TRANSLATIONS
  // ============================================
  const t = {
    // Header
    title: isEnglish ? "User Management" : "إدارة المستخدمين",
    usersCount: isEnglish ? "users" : "مستخدم",
    
    // Success Messages
    userCreated: isEnglish ? "User created successfully" : "تم إنشاء المستخدم بنجاح",
    passwordUpdated: isEnglish ? "Password updated successfully" : "تم تحديث كلمة المرور",
    
    // User List
    createdOn: isEnglish ? "Created on" : "أُنشئ في",
    superAdmin: isEnglish ? "Super Admin" : "مشرف رئيسي",
    admin: isEnglish ? "Admin" : "مشرف",
    changePassword: isEnglish ? "Change Password" : "تغيير كلمة المرور",
    newPassword: isEnglish ? "New Password" : "كلمة المرور الجديدة",
    confirmDelete: isEnglish ? "Confirm Delete?" : "تأكيد الحذف؟",
    delete: isEnglish ? "Delete" : "حذف",
    cancel: isEnglish ? "Cancel" : "إلغاء",
    
    // Add User Form
    addUserTitle: isEnglish ? "Add New User" : "إضافة مستخدم جديد",
    username: isEnglish ? "Username" : "اسم المستخدم",
    usernamePlaceholder: "username",
    password: isEnglish ? "Password" : "كلمة المرور",
    passwordPlaceholder: "••••••••",
    role: isEnglish ? "Role" : "الصلاحية",
    roleAdmin: isEnglish ? "Admin" : "مشرف",
    roleSuperAdmin: isEnglish ? "Super Admin" : "مشرف رئيسي",
    createUser: isEnglish ? "Create User" : "إنشاء المستخدم",
    
    // Errors
    usernameRequired: isEnglish ? "Username is required" : "اسم المستخدم مطلوب",
    passwordMinLength: isEnglish ? "Password must be at least 4 characters" : "كلمة المرور يجب أن تكون 4 أحرف على الأقل",
    usernameTaken: isEnglish ? "Username is already taken" : "اسم المستخدم مستخدم مسبقاً",
    errorOccurred: isEnglish ? "An error occurred" : "حدث خطأ",
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const uname = form.username.trim();
    if (!uname) return setFormError(t.usernameRequired);
    if (form.password.length < 4) return setFormError(t.passwordMinLength);
    if (users.some((u) => u.username === uname)) return setFormError(t.usernameTaken);
    try {
      await addUser({ username: uname, password: form.password, role: form.role });
      setForm({ username: "", password: "", role: "admin" });
      setFormError("");
      setSuccess(t.userCreated);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setFormError(err?.message ?? t.errorOccurred);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setConfirmDelete(null);
  };

  const handleChangePass = async (id: string) => {
    if (newPass.length < 4) return;
    await updateUserPassword(id, newPass);
    setChangingPassId(null);
    setNewPass("");
    setSuccess(t.passwordUpdated);
    setTimeout(() => setSuccess(""), 3000);
  };

  const roleLabel = (role: AdminUser["role"]) => role === "superadmin" ? t.superAdmin : t.admin;
  const roleColor = (role: AdminUser["role"]) => role === "superadmin" ? "bg-[#3d1a06] text-white" : "bg-blue-100 text-blue-700";

  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[hsl(22,85%,18%)]">{t.title}</h2>
        <span className="text-sm text-gray-400">{users.length} {t.usersCount}</span>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold"
        >
          ✓ {success}
        </motion.div>
      )}

      {/* Users list */}
      <div className="grid gap-3 mb-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl border-2 border-[hsl(30,15%,88%)] p-5 flex flex-wrap items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[hsl(22,85%,95%)] flex items-center justify-center">
              {user.role === "superadmin" ? (
                <ShieldCheck size={20} className="text-[hsl(22,85%,18%)]" />
              ) : (
                <UserCog size={20} className="text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[hsl(22,85%,18%)] text-base" dir="ltr">{user.username}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {t.createdOn} {new Date(user.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColor(user.role)}`}>
              {roleLabel(user.role)}
            </span>

            {/* Change password */}
            {changingPassId === user.id ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder={t.newPassword}
                  dir="ltr"
                  minLength={4}
                  className="border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-lg px-3 py-2 text-sm outline-none w-40"
                />
                <button
                  onClick={() => handleChangePass(user.id)}
                  disabled={newPass.length < 4}
                  className="bg-[#3d1a06] text-white px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-40"
                >
                  <Save size={14} />
                </button>
                <button
                  onClick={() => { setChangingPassId(null); setNewPass(""); }}
                  className="text-gray-400 px-2 py-2 rounded-lg text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setChangingPassId(user.id)}
                className="text-xs font-bold text-gray-500 hover:text-[hsl(22,85%,18%)] border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {t.changePassword}
              </button>
            )}

            {/* Delete button */}
            {user.id !== currentUserId && !(user.role === "superadmin" && users.filter((u) => u.role === "superadmin").length === 1) && (
              confirmDelete === user.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-500 font-semibold">{t.confirmDelete}</span>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-red-600"
                  >
                    {t.delete}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="text-gray-400 text-xs px-2 py-1.5 rounded-lg"
                  >
                    {t.cancel}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(user.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )
            )}
          </div>
        ))}
      </div>

      {/* Add user form */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-[hsl(30,15%,80%)] p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserPlus size={20} className="text-[hsl(22,85%,18%)]" />
          <h3 className="font-black text-[hsl(22,85%,18%)]">{t.addUserTitle}</h3>
        </div>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.username}</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder={t.usernamePlaceholder}
              dir="ltr"
              className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.password}</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={t.passwordPlaceholder}
                dir="ltr"
                minLength={4}
                className={`w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${
                  language === 'ar' ? 'pl-10' : 'pr-10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                  language === 'ar' ? 'left-3' : 'right-3'
                }`}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.role}</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser["role"] })}
              className="w-full border-2 border-[hsl(30,15%,85%)] focus:border-[hsl(40,88%,52%)] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors bg-white"
            >
              <option value="admin">{t.roleAdmin}</option>
              <option value="superadmin">{t.roleSuperAdmin}</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            {formError && (
              <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
                <AlertTriangle size={12} /> {formError}
              </p>
            )}
            <button
              type="submit"
              className="btn-gold py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={15} />
              {t.createUser}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}