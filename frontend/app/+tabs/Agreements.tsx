import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { FileText, ChevronRight } from 'lucide-react-native';
import { agreementStorage, type AgreementWithParties } from '@/lib/LocalStorage';
import { Agreementstyles } from '@/styles/Agreement_Design';
import { useAuth } from '../+auth/context/authContext';

export default function Agreements() {
  const router = useRouter();
  const [agreements, setAgreements] = useState<AgreementWithParties[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {user} = useAuth();

  const fetchAgreements = async () => {
    if (!user) return;
    
    try {
      setError(null);

      const agreementData = await agreementStorage.getAll();

      const userAgreementsData = agreementData.filter(
      (agreement) => agreement.user_email === user.email
      );

      // Fetch full agreements with parties
      const agreementsWithParties: AgreementWithParties[] = await Promise.all(
        userAgreementsData.map(async (agreement) => {
          const fullAgreement = await agreementStorage.getById(agreement.id);
          return fullAgreement!;
        })
      );

      agreementsWithParties.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setAgreements(agreementsWithParties);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load agreements');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAgreements();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAgreements();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'signed':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderAgreementItem = ({ item }: { item: AgreementWithParties }) => (
    <TouchableOpacity
      style={Agreementstyles.agreementCard}
      onPress={() => router.push(`/+agreement/${item.id}`)}
    >
      <View style={Agreementstyles.cardHeader}>
        <View style={Agreementstyles.iconContainer}>
          <FileText size={24} color="#B6771D" />
        </View>
        <View style={Agreementstyles.cardContent}>
          <Text style={Agreementstyles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={Agreementstyles.cardDate}>{formatDate(item.created_at)}</Text>
        </View>
        <View style={Agreementstyles.cardRight}>
          <View
            style={[
              Agreementstyles.statusBadge,
              { backgroundColor: `${getStatusColor(item.status)}20` },
            ]}
          >
            <Text
              style={[Agreementstyles.statusText, { color: getStatusColor(item.status) }]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </View>
      </View>
      <Text style={Agreementstyles.cardSubtext} numberOfLines={2}>
        {item.parties.length} {item.parties.length === 1 ? 'party' : 'parties'}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={Agreementstyles.emptyContainer}>
      <FileText size={64} color="#3379e2ff" />
      <Text style={Agreementstyles.emptyTitle}>No Agreements Yet</Text>
      <Text style={Agreementstyles.emptyText}>
        Create your first agreement using the Create tab
      </Text>
    </View>
  );

  if (error) {
    return (
      <View style={Agreementstyles.errorContainer}>
        <Text style={Agreementstyles.errorText}>{error}</Text>
        <TouchableOpacity style={Agreementstyles.retryButton} onPress={fetchAgreements}>
          <Text style={Agreementstyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={Agreementstyles.container}>
      <FlatList
        data={agreements}
        renderItem={renderAgreementItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          Agreementstyles.listContent,
          agreements.length === 0 && Agreementstyles.listContentEmpty,
        ]}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}