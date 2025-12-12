import { getTransactionDetails, TransactionDetails } from "@/services/wallet";
import { useTheme } from "@/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TransactionDetailsScreen() {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";
  const { reference } = useLocalSearchParams<{ reference: string }>();

  const [transaction, setTransaction] = useState<TransactionDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!reference) {
        setError("Transaction reference not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getTransactionDetails(reference);
        setTransaction(data);
      } catch (err: any) {
        setError(err.message || "Failed to load transaction details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [reference]);

  const formatDateTime = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  const formatCurrency = (val: number) =>
    `₦${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return theme.colors.success || theme.colors.primary;
      case "PENDING":
        return "#F59E0B";
      case "FAILED":
        return theme.colors.danger;
      default:
        return theme.colors.muted;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <Ionicons
            name="arrow-down-circle"
            size={32}
            color={theme.colors.primary}
          />
        );
      case "WITHDRAWAL":
        return (
          <Ionicons
            name="arrow-up-circle"
            size={32}
            color={theme.colors.danger}
          />
        );
      case "LOCK":
        return (
          <Feather name="lock" size={28} color={theme.colors.actionIconLock} />
        );
      case "TRANSFER":
        return (
          <Ionicons
            name="swap-horizontal"
            size={32}
            color={theme.colors.accent}
          />
        );
      case "REFUND":
        return (
          <MaterialCommunityIcons
            name="cash-refund"
            size={32}
            color={theme.colors.success || theme.colors.primary}
          />
        );
      default:
        return (
          <Ionicons
            name="receipt-outline"
            size={32}
            color={theme.colors.muted}
          />
        );
    }
  };

  const getTypeIconBg = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return theme.colors.actionIconDepositBg;
      case "WITHDRAWAL":
        return theme.colors.actionIconSpendBg;
      case "LOCK":
        return theme.colors.actionIconLockBg;
      case "TRANSFER":
        return theme.colors.actionIconLockBg;
      case "REFUND":
        return theme.colors.actionIconRedeemBg;
      default:
        return theme.colors.card;
    }
  };

  const getTypeLabel = (type: string, entryType: string) => {
    switch (type) {
      case "DEPOSIT":
        return "Deposit";
      case "WITHDRAWAL":
        return "Withdrawal";
      case "LOCK":
        return "Budget Lock";
      case "TRANSFER":
        return entryType === "CREDIT" ? "Transfer Received" : "Transfer Sent";
      case "REFUND":
        return "Refund";
      default:
        return type || "Transaction";
    }
  };

  const Glass = ({
    children,
    style,
    radius = 12,
  }: {
    children: React.ReactNode;
    style?: any;
    radius?: number;
  }) => {
    if (!isDark) {
      return <View style={style}>{children}</View>;
    }
    return (
      <View
        style={[
          style,
          {
            position: "relative",
            overflow: "hidden",
            borderRadius: radius,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
          },
        ]}
      >
        <BlurView
          intensity={30}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        {children}
      </View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          style={styles.backButtonWrapper}
        >
          <Glass
            radius={14}
            style={[
              styles.backButton,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : theme.colors.card,
              },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={theme.colors.primary}
            />
          </Glass>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Transaction Details
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.muted }]}>
              Loading transaction...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={64}
              color={theme.colors.danger}
            />
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={[
                styles.retryButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : transaction ? (
          <>
            {/* Transaction Icon & Amount Card */}
            <View
              style={[
                styles.amountCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : theme.colors.card,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.typeIconContainer,
                  { backgroundColor: getTypeIconBg(transaction.type) },
                ]}
              >
                {getTypeIcon(transaction.type)}
              </View>

              <Text
                style={[styles.transactionType, { color: theme.colors.muted }]}
              >
                {getTypeLabel(transaction.type, transaction.entryType)}
              </Text>

              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      transaction.entryType === "CREDIT"
                        ? theme.colors.primary
                        : theme.colors.danger,
                  },
                ]}
              >
                {transaction.entryType === "CREDIT" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${getStatusColor(transaction.status)}20`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(transaction.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(transaction.status) },
                  ]}
                >
                  {transaction.status}
                </Text>
              </View>
            </View>

            {/* Transaction Details Card */}
            <View
              style={[
                styles.detailsCard,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : theme.colors.card,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>
                Transaction Information
              </Text>

              <View style={styles.detailRow}>
                <Text
                  style={[styles.detailLabel, { color: theme.colors.muted }]}
                >
                  Reference
                </Text>
                <Text
                  style={[styles.detailValue, { color: theme.colors.text }]}
                  selectable
                >
                  {transaction.reference}
                </Text>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />

              {transaction.recipientName && (
                <>
                  <View style={styles.detailRow}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: theme.colors.muted },
                      ]}
                    >
                      {transaction.entryType === "CREDIT" ? "From" : "To"}
                    </Text>
                    <Text
                      style={[styles.detailValue, { color: theme.colors.text }]}
                    >
                      {transaction.recipientName}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.colors.border },
                    ]}
                  />
                </>
              )}

              {transaction.name && (
                <>
                  <View style={styles.detailRow}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: theme.colors.muted },
                      ]}
                    >
                      Name
                    </Text>
                    <Text
                      style={[styles.detailValue, { color: theme.colors.text }]}
                    >
                      {transaction.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.colors.border },
                    ]}
                  />
                </>
              )}

              <View style={styles.detailRow}>
                <Text
                  style={[styles.detailLabel, { color: theme.colors.muted }]}
                >
                  Date & Time
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    styles.detailValueSmall,
                    { color: theme.colors.text },
                  ]}
                >
                  {formatDateTime(transaction.createdAt)}
                </Text>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border },
                ]}
              />

              <View style={styles.detailRow}>
                <Text
                  style={[styles.detailLabel, { color: theme.colors.muted }]}
                >
                  Transaction Type
                </Text>
                <Text
                  style={[styles.detailValue, { color: theme.colors.text }]}
                >
                  {transaction.entryType}
                </Text>
              </View>

              {transaction.fee > 0 && (
                <>
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.colors.border },
                    ]}
                  />
                  <View style={styles.detailRow}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: theme.colors.muted },
                      ]}
                    >
                      Fee
                    </Text>
                    <Text
                      style={[styles.detailValue, { color: theme.colors.text }]}
                    >
                      {formatCurrency(transaction.fee)}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Total Section (if fee exists) */}
            {transaction.fee > 0 && (
              <View
                style={[
                  styles.totalCard,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : theme.colors.card,
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : theme.colors.border,
                  },
                ]}
              >
                <View style={styles.totalRow}>
                  <Text
                    style={[styles.totalLabel, { color: theme.colors.muted }]}
                  >
                    Amount
                  </Text>
                  <Text
                    style={[styles.totalValue, { color: theme.colors.text }]}
                  >
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text
                    style={[styles.totalLabel, { color: theme.colors.muted }]}
                  >
                    Fee
                  </Text>
                  <Text
                    style={[styles.totalValue, { color: theme.colors.text }]}
                  >
                    {formatCurrency(transaction.fee)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.border },
                  ]}
                />
                <View style={styles.totalRow}>
                  <Text
                    style={[
                      styles.grandTotalLabel,
                      { color: theme.colors.text },
                    ]}
                  >
                    Total
                  </Text>
                  <Text
                    style={[
                      styles.grandTotalValue,
                      {
                        color:
                          transaction.entryType === "CREDIT"
                            ? theme.colors.primary
                            : theme.colors.danger,
                      },
                    ]}
                  >
                    {transaction.entryType === "CREDIT" ? "+" : "-"}
                    {formatCurrency(transaction.amount + transaction.fee)}
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 60,
      android: (StatusBar.currentHeight || 0) + 16,
    }),
    paddingBottom: 16,
  },
  backButtonWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    marginLeft: 15,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  headerSpacer: {
    width: 45,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  amountCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  typeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionType: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontFamily: "Poppins_700Bold",
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "uppercase",
  },
  detailsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  detailValueSmall: {
    fontSize: 13,
  },
  divider: {
    height: 1,
  },
  totalCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  totalValue: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  grandTotalValue: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
});
