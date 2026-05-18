import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowForward, User, ShieldCheck, Lock } from "lucide-react";

const AddUserForm = () => {
  return (
    <main className="flex-1 mt-16 p-4 md:p-16 bg-[#F8F7F4] font-body" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-headline text-on-surface">
            إضافة مستخدم جديد
          </h2>
          <Button variant="link" className="text-primary gap-1">
            <ArrowForward className="w-4 h-4 rotate-180" />
            العودة للقائمة
          </Button>
        </div>

        <Card className="bg-white rounded-xl shadow-sm border-surface-variant overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <form className="space-y-8">
              {/* Section 1: Personal Info */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <User className="w-5 h-5" />
                  <h3 className="text-lg font-bold font-headline">
                    المعلومات الشخصية
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      placeholder="أدخل الاسم الكامل"
                      className="bg-background border-surface-variant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      dir="ltr"
                      className="text-left bg-background border-surface-variant"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      dir="ltr"
                      className="text-left bg-background border-surface-variant"
                      placeholder="+966 50 000 0000"
                    />
                  </div>
                </div>
              </section>

              <hr className="border-surface-variant" />

              {/* Section 2: Roles */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-lg font-bold font-headline">
                    الصلاحيات والدور
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>الدور الوظيفي *</Label>
                    <Select>
                      <SelectTrigger className="bg-background border-surface-variant">
                        <SelectValue placeholder="اختر الدور المناسب..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">مسؤول نظام</SelectItem>
                        <SelectItem value="archivist">أرشيفي</SelectItem>
                        <SelectItem value="researcher">باحث</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F1ECF5]/30 rounded-lg border border-surface-variant">
                    <div className="space-y-0.5">
                      <Label className="text-sm">حالة الحساب</Label>
                      <p className="text-xs text-on-surface-variant">
                        السماح للمستخدم بتسجيل الدخول
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-secondary" />
                  </div>
                </div>
              </section>

              <hr className="border-surface-variant" />

              {/* Section 3: Security */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Lock className="w-5 h-5" />
                  <h3 className="text-lg font-bold font-headline">الأمان</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور *</Label>
                    <Input
                      type="password"
                      id="password"
                      dir="ltr"
                      className="bg-background border-surface-variant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">تأكيد كلمة المرور *</Label>
                    <Input
                      type="password"
                      id="confirm"
                      dir="ltr"
                      className="bg-background border-surface-variant"
                    />
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                <Button
                  variant="outline"
                  className="px-8 border-surface-variant text-on-surface-variant"
                >
                  إلغاء
                </Button>
                <Button className="px-8 bg-primary hover:bg-primary-container text-white">
                  حفظ البيانات
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AddUserForm;
