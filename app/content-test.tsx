import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { getAllLevels, getTopicsByLevel, getUnitsByTopic } from '@/lib/content';

export default function ContentTestScreen() {
  const levels = getAllLevels();
  const beginnerTopics = getTopicsByLevel('level-beginner');
  const greetingsUnits = getUnitsByTopic('topic-greetings');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Content Diagnostic</Text>

      <Text style={styles.section}>Levels ({levels.length})</Text>
      {levels.map((level) => (
        <View key={level.id} style={styles.row}>
          <Text style={styles.icon}>{level.icon}</Text>
          <View>
            <Text style={styles.title}>{level.title.en}</Text>
            <Text style={styles.id}>{level.id}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.section}>Beginner Topics ({beginnerTopics.length})</Text>
      {beginnerTopics.map((topic) => (
        <View key={topic.id} style={styles.row}>
          <Text style={styles.icon}>{topic.icon}</Text>
          <View>
            <Text style={styles.title}>{topic.title.en}</Text>
            <Text style={styles.id}>{topic.id}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.section}>Greetings Units ({greetingsUnits.length})</Text>
      {greetingsUnits.map((unit) => (
        <View key={unit.id} style={styles.row}>
          <Text style={styles.icon}>{unit.icon}</Text>
          <View>
            <Text style={styles.title}>{unit.title.en}</Text>
            <Text style={styles.id}>{unit.id}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 60 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  section: { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  icon: { fontSize: 28, width: 40, textAlign: 'center' },
  title: { fontSize: 16, fontWeight: '500' },
  id: { fontSize: 12, color: '#aaa', marginTop: 2 },
});
