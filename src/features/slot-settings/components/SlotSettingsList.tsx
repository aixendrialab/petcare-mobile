// src/features/slot-settings/components/SlotSettingsList.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SlotSetting } from "../types";
import JsonViewerModal from "@/src/components/JsonViewerModal";
import {api } from '@/src/api';

type Props = {
  settings: SlotSetting[];
  onAdd: () => void;
  onEdit: (s: SlotSetting) => void;
  onDelete: (s: SlotSetting) => void;
  onPreview: (s: SlotSetting) => void;
};

export default function SlotSettingsList({
  settings,
  onAdd,
  onEdit,
  onDelete,
  onPreview,
}: Props) {
  const [jsonData, setJsonData] = React.useState<any>(null);
  const [showJson, setShowJson] = React.useState(false);
  const [loadingId, setLoadingId] = React.useState<number | null>(null);

  async function handleViewJson(s: SlotSetting) {
    try {
      setLoadingId(s.id);
      const res = await api.get(`/slot-settings/${s.id}/export?include_overrides=true`);
      setJsonData(res.data);
      setShowJson(true);
    } catch (err) {
      console.error("❌ Error fetching export JSON:", err);
      alert("Failed to fetch JSON data (check console).");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <View>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>Slot Settings</Text>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {settings.length === 0 ? (
        <Text style={styles.empty}>No slot settings. Tap “Add” to create one.</Text>
      ) : (
        <ScrollView>
          {settings.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                Effective {s.effective_from ?? "—"}
                {s.effective_to ? ` → ${s.effective_to}` : ""}
              </Text>

              <Text style={styles.cardSub}>
                {s.slot_summary ?? "—"} • Slot {s.slot_minutes}m + Gap {s.gap_minutes}m • Cap{" "}
                {s.per_slot_capacity}
              </Text>

              <Text style={styles.cardSubSmall}>
                Breaks: {s.break_count ?? 0} • Lead: {s.lead_time_minutes}m • Window:{" "}
                {s.booking_window_days}d • {s.visible_to_parents ? "Visible" : "Hidden"}
              </Text>

              <View style={styles.row}>
                <TouchableOpacity onPress={() => onEdit(s)} style={styles.btn}>
                  <Text style={styles.btnTxt}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onPreview(s)}
                  style={[styles.btn, styles.info]}
                >
                  <Text style={[styles.btnTxt, styles.infoTxt]}>Preview</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onDelete(s)}
                  style={[styles.btn, styles.danger]}
                >
                  <Text style={[styles.btnTxt, styles.btnDangerTxt]}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleViewJson(s)}
                  style={[styles.btn, styles.jsonBtn]}
                  disabled={loadingId === s.id}
                >
                  {loadingId === s.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={[styles.btnTxt, styles.jsonBtnTxt]}>View JSON</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <JsonViewerModal
        visible={showJson}
        data={jsonData}
        onClose={() => setShowJson(false)}
        title="Slot Setting Export JSON"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#0b61ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "700" },
  empty: { color: "#777" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: { fontWeight: "700", marginBottom: 4 },
  cardSub: { color: "#333", marginBottom: 4 },
  cardSubSmall: { color: "#777", marginBottom: 10, fontSize: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  btn: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnTxt: { fontWeight: "600" },
  info: { backgroundColor: "#dbeafe" },
  infoTxt: { color: "#1d4ed8" },
  danger: { backgroundColor: "#fee2e2" },
  btnDangerTxt: { color: "#b91c1c" },
  jsonBtn: { backgroundColor: "#111827" },
  jsonBtnTxt: { color: "#fff" },
});
