import { useLocalSearchParams } from 'expo-router';
import { SupplierForm } from '@/components/SupplierForm';
import { useApp } from '@/context/AppContext';
export default function EditSupplierScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { suppliers } = useApp();
  return <SupplierForm supplier={suppliers.find((item) => item.id === id)} />;
}
