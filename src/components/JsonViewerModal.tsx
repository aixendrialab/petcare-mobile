// src/features/slot-settings/components/JsonViewerModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

type Props = {
  visible: boolean;
  data: any;
  onClose: () => void;
  title?: string;
};

export default function JsonViewerModal({ visible, data, onClose, title }: Props) {
  if (!visible) return null;

  const jsonString = data ? JSON.stringify(data, null, 2) : "No data";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      alert("✅ JSON copied to clipboard");
    } catch (e) {
      console.error("Copy failed:", e);
      alert("Copy failed. See console.");
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title?.replace(/\s+/g, "_") || "data"}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  // very light syntax highlighting (string, number, key)
  const highlight = (text: string) => {
    const pattern =
      /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|\b-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?\b)/g;
    return text.split(pattern).map((part, i) => {
      if (/^"/.test(part) && /:$/.test(part)) {
        return (
          <Text key={i} style={{ color: "#9CDCFE" }}>
            {part}
          </Text>
        ); // key
      } else if (/^"/.test(part)) {
        return (
          <Text key={i} style={{ color: "#CE9178" }}>
            {part}
          </Text>
        ); // string
      } else if (/true|false/.test(part)) {
        return (
          <Text key={i} style={{ color: "#569CD6" }}>
            {part}
          </Text>
        ); // boolean
      } else if (/null/.test(part)) {
        return (
          <Text key={i} style={{ color: "#808080" }}>
            {part}
          </Text>
        ); // null
      } else if (/\d/.test(part)) {
        return (
          <Text key={i} style={{ color: "#B5CEA8" }}>
            {part}
          </Text>
        ); // number
      }
      return <Text key={i}>{part}</Text>;
    });
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{title ?? "JSON Viewer"}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* BODY */}
        <ScrollView style={styles.body}>
          <Text style={styles.json}>{highlight(jsonString)}</Text>
        </ScrollView>

        {/* FOOTER BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleCopy} style={[styles.footerBtn, styles.copy]}>
            <Text style={styles.footerTxt}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownload} style={[styles.footerBtn, styles.download]}>
            <Text style={styles.footerTxt}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={[styles.footerBtn, styles.closeBtn]}>
            <Text style={styles.footerTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "700" },
  close: { color: "#aaa", fontSize: 18 },
  body: { marginTop: 8, maxHeight: 400 },
  json: { fontFamily: "monospace", fontSize: 12, color: "#d4d4d4" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  footerBtn: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  copy: { backgroundColor: "#3b82f6" },
  download: { backgroundColor: "#16a34a" },
  closeBtn: { backgroundColor: "#555" },
  footerTxt: { color: "#fff", fontWeight: "600" },
});
