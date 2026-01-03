import SearchInput from "@/components/SearchInput";
import { useDebounce } from "@/hooks/useDebounce";
import { searchCompanies } from "@/services/search";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CompanyPicker({
  companies,
  selected,
  onSelect,
  styles,
  categoryId,
}: {
  companies: { id: string; name: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  styles: any;
  categoryId?: string;
}) {
  const { theme, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [visible, setVisible] = useState(false);
  const [renderModal, setRenderModal] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslate = useRef(new Animated.Value(40)).current;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string }[] | null
  >(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    if (!categoryId) {
      // Filter locally if no categoryId
      const filtered = companies.filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
      return;
    }

    // Search via API
    const search = async () => {
      setIsSearching(true);
      try {
        const results = await searchCompanies(categoryId, debouncedQuery);
        setSearchResults(results);
      } catch {
        // Fallback to local filter
        const filtered = companies.filter((c) =>
          c.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } finally {
        setIsSearching(false);
      }
    };

    search();
  }, [debouncedQuery, categoryId, companies]);

  // Display list: search results or all companies
  const displayList = useMemo(() => {
    if (searchResults !== null) {
      return searchResults;
    }
    return companies;
  }, [searchResults, companies]);

  const open = () => {
    setSearchQuery("");
    setSearchResults(null);
    setRenderModal(true);
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslate, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => setVisible(true));
    });
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslate, {
        toValue: 40,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setRenderModal(false);
      setSearchQuery("");
      setSearchResults(null);
    });
  };

  const selectedItem = companies.find((c) => c.id === selected);

  return (
    <>
      <TouchableOpacity style={styles.pickerButton} onPress={open}>
        <Ionicons
          name="business"
          size={18}
          color={theme.colors.primary}
          style={{ marginRight: 10 }}
        />
        <Text style={styles.pickerText}>
          {selectedItem?.name ?? "Select Company"}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={theme.colors.muted}
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>

      {renderModal && (
        <Modal transparent visible={renderModal} animationType="none">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.45)",
                opacity: overlayOpacity,
                justifyContent: "flex-end",
              }}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={close}
                accessible={false}
              />
              <Animated.View
                style={{
                  backgroundColor: isDark ? "#1B263B" : "#fff",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  maxHeight: "70%",
                  paddingBottom: 24,
                  transform: [{ translateY: sheetTranslate }],
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "#E2E8F0",
                    borderRadius: 2,
                    alignSelf: "center",
                    marginTop: 12,
                    marginBottom: 4,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 17,
                    color: theme.colors.text,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Select Company
                </Text>

                {/* Search Input */}
                <SearchInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search companies..."
                  isLoading={isSearching}
                />

                <FlatList
                  data={displayList}
                  keyExtractor={(i) => i.id}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        alignItems: "center",
                        paddingVertical: 40,
                        paddingHorizontal: 20,
                      }}
                    >
                      <Ionicons
                        name="business-outline"
                        size={48}
                        color={isDark ? "rgba(255,255,255,0.3)" : "#CBD5E1"}
                      />
                      <Text
                        style={{
                          fontFamily: "Poppins_500Medium",
                          fontSize: 15,
                          color: isDark ? "rgba(255,255,255,0.5)" : "#64748B",
                          marginTop: 12,
                          textAlign: "center",
                        }}
                      >
                        {searchQuery.trim()
                          ? "No companies found"
                          : "No companies available"}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 13,
                          color: isDark ? "rgba(255,255,255,0.35)" : "#94A3B8",
                          marginTop: 4,
                          textAlign: "center",
                        }}
                      >
                        {searchQuery.trim()
                          ? "Try a different search term"
                          : "Try selecting a different category"}
                      </Text>
                    </View>
                  )}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "#F1F5F9",
                        marginLeft: 20,
                      }}
                    />
                  )}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  renderItem={({ item }) => {
                    const active = selected === item.id;
                    return (
                      <Pressable
                        onPress={() => {
                          onSelect(item.id);
                          close();
                        }}
                        style={({ pressed }) => [
                          styles.modalItem,
                          pressed && {
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.06)"
                              : "#F8FAFC",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.catIcon,
                            {
                              backgroundColor: active
                                ? theme.colors.primary
                                : isDark
                                ? "rgba(255,255,255,0.08)"
                                : "#F1F5F9",
                            },
                          ]}
                        >
                          <Ionicons
                            name="business"
                            size={18}
                            color={active ? "#fff" : theme.colors.primary}
                          />
                        </View>
                        <Text
                          style={[
                            styles.modalItemText,
                            {
                              color: active
                                ? theme.colors.primary
                                : theme.colors.text,
                              fontFamily: active
                                ? "Poppins_600SemiBold"
                                : "Poppins_500Medium",
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                        {active && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={theme.colors.primary}
                            style={{ marginLeft: "auto", marginRight: 8 }}
                          />
                        )}
                      </Pressable>
                    );
                  }}
                />
                <TouchableOpacity style={styles.modalClose} onPress={close}>
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </>
  );
}
