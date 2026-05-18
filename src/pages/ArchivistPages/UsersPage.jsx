import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const UsersManagement = () => {
  return (
    <main
      className="md:pr-64 pt-16 min-h-screen bg-background font-body"
      dir="rtl"
    >
      <div className="max-w-[1440px] mx-auto p-4 md:p-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface">
              إدارة المستخدمين
            </h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              إدارة صلاحيات الوصول وأدوار المستخدمين في النظام
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-container text-white gap-2 px-6 py-6 h-auto rounded-lg">
            <Plus className="w-5 h-5" />
            إضافة مستخدم جديد
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between border border-surface-variant">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <Input
              className="pr-10 bg-white border-surface-variant"
              placeholder="البحث عن مستخدم (الاسم، البريد الإلكتروني)..."
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button variant="outline" className="rounded-full gap-1 text-sm">
              الدور: الكل <ChevronDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="rounded-full gap-1 text-sm">
              الحالة: الكل <ChevronDown className="w-4 h-4" />
            </Button>
            <Badge
              variant="secondary"
              className="bg-surface-variant text-on-surface gap-2 px-3 py-1.5 rounded-full font-normal"
            >
              أرشيفي{" "}
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
            </Badge>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-surface-variant overflow-hidden">
          <Table>
            <TableHeader className="bg-[#F8F7F4]">
              <TableRow>
                <TableHead className="w-12 text-right">
                  <input
                    type="checkbox"
                    className="rounded border-surface-variant"
                  />
                </TableHead>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الدور الوظيفي</TableHead>
                <TableHead className="text-right">تاريخ الانضمام</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-center w-24">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* User Row Example */}
              <TableRow className="hover:bg-[#F1F0ED] group transition-colors">
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-surface-variant"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-surface-variant">
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>س أ</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">سارة أحمد</span>
                  </div>
                </TableCell>
                <TableCell className="text-left dir-ltr">
                  sara.ahmed@archive.gov
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20 px-3"
                  >
                    مسؤول
                  </Badge>
                </TableCell>
                <TableCell className="text-on-surface-variant">
                  ١٢ مايو ٢٠٢٣
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    نشط
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-on-surface-variant hover:text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-on-surface-variant hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-surface-variant flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              عرض <span className="font-medium text-on-surface">١</span> إلى{" "}
              <span className="font-medium text-on-surface">١٠</span> من أصل{" "}
              <span className="font-medium text-on-surface">٤٥</span> مستخدم
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="w-8 h-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                className="w-8 h-8 bg-primary/10 text-primary hover:bg-primary/20"
                variant="ghost"
              >
                ١
              </Button>
              <Button variant="ghost" className="w-8 h-8">
                ٢
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UsersManagement;
