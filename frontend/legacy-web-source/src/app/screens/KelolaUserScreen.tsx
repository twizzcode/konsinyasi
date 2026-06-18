import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, UserPlus, Mail, Shield, Trash2, Edit } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'kasir';
}

const initialUsers: UserType[] = [
  { id: '1', name: 'Budi Santoso', email: 'budi@tokoberkah.com', role: 'owner' },
  { id: '2', name: 'Siti Aminah', email: 'siti@tokoberkah.com', role: 'admin' },
  { id: '3', name: 'Ahmad Yani', email: 'ahmad@tokoberkah.com', role: 'kasir' }
];

export function KelolaUserScreen() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'kasir'>('kasir');

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge variant="info">Pemilik</Badge>;
      case 'admin':
        return <Badge variant="success">Admin</Badge>;
      case 'kasir':
        return <Badge variant="neutral">Kasir</Badge>;
      default:
        return <Badge variant="neutral">{role}</Badge>;
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      id: (users.length + 1).toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('kasir');
    alert('User berhasil ditambahkan!');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(u => u.id !== id));
      alert('User berhasil dihapus!');
    }
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">Kelola User/Admin</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 hover:bg-white/30 text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-info/10 border border-info/20 rounded-xl p-4">
            <div className="flex gap-2 mb-2">
              <Shield className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm mb-1">Tentang Hak Akses</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li><span className="font-medium">Pemilik:</span> Akses penuh ke semua fitur</li>
                  <li><span className="font-medium">Admin:</span> Dapat mengelola barang, penitip, dan laporan</li>
                  <li><span className="font-medium">Kasir:</span> Hanya dapat melakukan transaksi</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-lg">Daftar User ({users.length})</h3>

          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate mb-1">{user.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                      {getRoleBadge(user.role)}
                    </div>
                    {user.role !== 'owner' && (
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Tambah User Baru"
        >
          <form onSubmit={handleAddUser} className="space-y-4">
            <Input
              type="text"
              placeholder="Nama lengkap"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              icon={<UserPlus className="w-5 h-5" />}
              label="Nama User"
              required
            />

            <Input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              required
            />

            <div>
              <label className="block text-sm text-foreground mb-2">Peran</label>
              <select
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'kasir')}
                required
              >
                <option value="kasir">Kasir</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="pt-2 space-y-2">
              <Button type="submit" fullWidth>
                Tambah User
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MobileLayout>
  );
}
