// src/locationpicker/index.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";
import debounce from "lodash.debounce";

export default function LocationPicker() {
  const { index } = useLocalSearchParams();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [coord, setCoord] = useState({
    latitude: 17.4474,
    longitude: 78.3568,
  });

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  /** Fetch suggestions */
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
      query
    )}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.warn("Search error", err);
    }
  };

  const debouncedSearch = debounce(fetchSuggestions, 400);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const selectSuggestion = (item: any) => {
    const lat = Number(item.lat);
    const lng = Number(item.lon);

    setCoord({
      latitude: lat,
      longitude: lng,
    });

    setAddress(item.display_name);
    setCity(
      item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        ""
    );

    setSearch(item.display_name);
    setSuggestions([]);
  };

  /** Return patch */
  const confirm = () => {
    router.replace({
      pathname: "/vet/profile",
      params: {
        locationIndex: index,
        patch: JSON.stringify({
          lat: Number(coord.latitude),
          lng: Number(coord.longitude),
          line1: address,
          city,
        }),
      },
    });
  };

  const staticUrl =
    `https://staticmap.openstreetmap.de/staticmap.php?center=${coord.latitude},${coord.longitude}` +
    `&zoom=15&size=600x400&markers=${coord.latitude},${coord.longitude},red`;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Search Box */}
      <TextInput
        value={search}
        onChangeText={handleSearchChange}
        placeholder="Search for a location"
        style={styles.searchInput}
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <FlatList
          style={styles.suggestionList}
          data={suggestions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => selectSuggestion(item)}
              style={styles.suggestionItem}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Lat / Lng manual input */}
      <View style={{ marginTop: 12, flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text>Latitude</Text>
          <TextInput
            style={styles.searchInput}
            keyboardType="numeric"
            value={String(coord.latitude)}
            onChangeText={(v) =>
              setCoord({
                ...coord,
                latitude: Number(v) || 0,
              })
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text>Longitude</Text>
          <TextInput
            style={styles.searchInput}
            keyboardType="numeric"
            value={String(coord.longitude)}
            onChangeText={(v) =>
              setCoord({
                ...coord,
                longitude: Number(v) || 0,
              })
            }
          />
        </View>
      </View>

      {/* Map Preview */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: staticUrl }}
          style={styles.mapImage}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Confirm Location" onPress={confirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  suggestionList: {
    maxHeight: 150,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  mapContainer: {
    marginTop: 20,
    width: "100%",
    height: 350,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
});
