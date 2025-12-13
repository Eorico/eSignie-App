import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function NoInternet () {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffffb1",
                padding: 20
            }}
        >
            <ActivityIndicator size={"large"}/>
            <Text
                style={{
                    marginTop: 20,
                    fontSize: 16,
                    fontWeight: "600",
                    textAlign: "center",
                }}
            >
                No internet connection!
            </Text>
            <Text
                style={{
                    marginTop: 8,
                    fontSize: 14,
                    color: '#666',
                    textAlign: 'center',
                }}
            >
                Waiting for network connections.
            </Text>
        </View>
    )
}