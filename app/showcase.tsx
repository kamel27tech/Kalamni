import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/atoms/Button';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

// ─── Shared layout primitives ─────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={section.titleRow}>
      <Text style={section.titleText}>{title}</Text>
    </View>
  );
}

function GroupLabel({ label }: { label: string }) {
  return <Text style={section.groupLabel}>{label}</Text>;
}

function Divider() {
  return <View style={section.divider} />;
}

const section = StyleSheet.create({
  titleRow: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.surface,
    paddingLeft: 10,
    marginBottom: 20,
    marginTop: 8,
  },
  titleText: {
    ...Typography.english.heading.h3,
    color: Colors.text.heading,
  },
  groupLabel: {
    ...Typography.english.title.s,
    color: Colors.text.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.default,
    marginVertical: 32,
  },
});

// ─── Typography section ───────────────────────────────────────────────────────

type TypeSample = {
  label: string;
  style: object;
  sample: string;
  rtl?: boolean;
};

const ENGLISH_SAMPLES: TypeSample[] = [
  { label: 'English / Heading / H1', style: Typography.english.heading.h1, sample: 'The Arabic Language' },
  { label: 'English / Heading / H2', style: Typography.english.heading.h2, sample: 'The Arabic Language' },
  { label: 'English / Heading / H3', style: Typography.english.heading.h3, sample: 'The Arabic Language' },
  { label: 'English / Title / L',    style: Typography.english.title.l,    sample: 'Lesson 1 · Introduction' },
  { label: 'English / Title / M',    style: Typography.english.title.m,    sample: 'Lesson 1 · Introduction' },
  { label: 'English / Title / S',    style: Typography.english.title.s,    sample: 'Lesson 1 · Introduction' },
  { label: 'English / Body / L',     style: Typography.english.body.l,     sample: 'Arabic is written right-to-left and uses its own distinct alphabet.' },
  { label: 'English / Body / M',     style: Typography.english.body.m,     sample: 'Arabic is written right-to-left and uses its own distinct alphabet.' },
];

const ARABIC_SAMPLES: TypeSample[] = [
  { label: 'Arabic / Heading / H1',   style: Typography.arabic.heading.h1,   sample: 'مرحباً بك في العربية', rtl: true },
  { label: 'Arabic / Heading / H2',   style: Typography.arabic.heading.h2,   sample: 'مرحباً بك في العربية', rtl: true },
  { label: 'Arabic / Title / L',      style: Typography.arabic.title.l,      sample: 'الدرس الأول · المقدمة',  rtl: true },
  { label: 'Arabic / Title / M',      style: Typography.arabic.title.m,      sample: 'الدرس الأول · المقدمة',  rtl: true },
  { label: 'Arabic / Body / L Bold',  style: Typography.arabic.body.lBold,   sample: 'اللغة العربية لغة جميلة وغنية.', rtl: true },
  { label: 'Arabic / Body / L Medium',style: Typography.arabic.body.lMedium, sample: 'اللغة العربية لغة جميلة وغنية.', rtl: true },
  { label: 'Arabic / Body / L Regular',style: Typography.arabic.body.lRegular,sample: 'اللغة العربية لغة جميلة وغنية.', rtl: true },
  { label: 'Arabic / Body / M Semi',  style: Typography.arabic.body.mSemi,   sample: 'تعلّم الحروف والكلمات.',         rtl: true },
  { label: 'Arabic / Body / M Regular',style: Typography.arabic.body.mRegular,sample: 'تعلّم الحروف والكلمات.',         rtl: true },
];

function TypeRow({ sample, label, style, rtl }: TypeSample) {
  return (
    <View style={type.row}>
      <Text style={[style as any, type.sample, rtl && type.rtl]}>{sample}</Text>
      <Text style={type.label}>{label}</Text>
    </View>
  );
}

const type = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
    paddingVertical: 14,
  },
  sample: {
    color: Colors.text.heading,
    marginBottom: 6,
  },
  rtl: {
    textAlign: 'right',
  },
  label: {
    ...Typography.english.body.m,
    color: Colors.text.disabled,
    fontSize: 11,
  },
});

// ─── Color section ────────────────────────────────────────────────────────────

type Swatch = { name: string; value: string };
type SwatchGroup = { group: string; swatches: Swatch[] };

const COLOR_GROUPS: SwatchGroup[] = [
  {
    group: 'Surface',
    swatches: [
      { name: 'surface.subtle',   value: Colors.surface.subtle   },
      { name: 'surface.lighter',  value: Colors.surface.lighter  },
      { name: 'surface.default',  value: Colors.surface.default  },
      { name: 'surface.disabled', value: Colors.surface.disabled },
    ],
  },
  {
    group: 'Border',
    swatches: [
      { name: 'border.subtle',    value: Colors.border.subtle    },
      { name: 'border.default',   value: Colors.border.default   },
      { name: 'border.darker',    value: Colors.border.darker    },
      { name: 'border.strong',    value: Colors.border.strong    },
      { name: 'border.disabled',  value: Colors.border.disabled  },
      { name: 'border.negative',  value: Colors.border.negative  },
    ],
  },
  {
    group: 'Text',
    swatches: [
      { name: 'text.heading',  value: Colors.text.heading  },
      { name: 'text.title',    value: Colors.text.title    },
      { name: 'text.body',     value: Colors.text.body     },
      { name: 'text.caption',  value: Colors.text.caption  },
      { name: 'text.disabled', value: Colors.text.disabled },
      { name: 'text.negative', value: Colors.text.negative },
    ],
  },
  {
    group: 'Icon',
    swatches: [
      { name: 'icon.default',  value: Colors.icon.default  },
      { name: 'icon.darker',   value: Colors.icon.darker   },
      { name: 'icon.subtle',   value: Colors.icon.subtle   },
      { name: 'icon.disabled', value: Colors.icon.disabled },
      { name: 'icon.negative', value: Colors.icon.negative },
    ],
  },
  {
    group: 'Primary',
    swatches: [
      { name: 'primary.surface',       value: Colors.primary.surface       },
      { name: 'primary.surfaceHover',  value: Colors.primary.surfaceHover  },
      { name: 'primary.surfaceSubtle', value: Colors.primary.surfaceSubtle },
      { name: 'primary.text',          value: Colors.primary.text          },
      { name: 'primary.border',        value: Colors.primary.border        },
    ],
  },
  {
    group: 'Secondary',
    swatches: [
      { name: 'secondary.surface',       value: Colors.secondary.surface       },
      { name: 'secondary.surfaceHover',  value: Colors.secondary.surfaceHover  },
      { name: 'secondary.surfaceSubtle', value: Colors.secondary.surfaceSubtle },
      { name: 'secondary.text',          value: Colors.secondary.text          },
      { name: 'secondary.border',        value: Colors.secondary.border        },
    ],
  },
  {
    group: 'Success',
    swatches: [
      { name: 'success.surface',       value: Colors.success.surface       },
      { name: 'success.surfaceHover',  value: Colors.success.surfaceHover  },
      { name: 'success.surfaceSubtle', value: Colors.success.surfaceSubtle },
      { name: 'success.text',          value: Colors.success.text          },
      { name: 'success.border',        value: Colors.success.border        },
    ],
  },
  {
    group: 'Error',
    swatches: [
      { name: 'error.surface',       value: Colors.error.surface       },
      { name: 'error.surfaceHover',  value: Colors.error.surfaceHover  },
      { name: 'error.surfaceSubtle', value: Colors.error.surfaceSubtle },
      { name: 'error.text',          value: Colors.error.text          },
      { name: 'error.border',        value: Colors.error.border        },
    ],
  },
  {
    group: 'Warning',
    swatches: [
      { name: 'warning.surface',       value: Colors.warning.surface       },
      { name: 'warning.surfaceHover',  value: Colors.warning.surfaceHover  },
      { name: 'warning.surfaceSubtle', value: Colors.warning.surfaceSubtle },
      { name: 'warning.text',          value: Colors.warning.text          },
      { name: 'warning.border',        value: Colors.warning.border        },
    ],
  },
  {
    group: 'Info',
    swatches: [
      { name: 'info.surface',       value: Colors.info.surface       },
      { name: 'info.surfaceHover',  value: Colors.info.surfaceHover  },
      { name: 'info.surfaceSubtle', value: Colors.info.surfaceSubtle },
      { name: 'info.text',          value: Colors.info.text          },
      { name: 'info.border',        value: Colors.info.border        },
    ],
  },
  {
    group: 'Data Viz',
    swatches: [
      { name: 'dataViz.orange',   value: Colors.dataViz.orange   },
      { name: 'dataViz.darkBlue', value: Colors.dataViz.darkBlue },
      { name: 'dataViz.blue',     value: Colors.dataViz.blue     },
    ],
  },
];

function SwatchCard({ name, value }: Swatch) {
  return (
    <View style={swatch.card}>
      <View style={[swatch.box, { backgroundColor: value }, swatch.boxBorder]} />
      <Text style={swatch.name} numberOfLines={2}>{name}</Text>
      <Text style={swatch.hex}>{value}</Text>
    </View>
  );
}

const SWATCH_SIZE = 56;
const swatch = StyleSheet.create({
  card: {
    width: '30%',
    marginBottom: 16,
  },
  box: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: 10,
    marginBottom: 6,
  },
  boxBorder: {
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  name: {
    ...Typography.english.body.m,
    color: Colors.text.body,
    fontSize: 11,
    lineHeight: 15,
  },
  hex: {
    ...Typography.english.body.m,
    color: Colors.text.disabled,
    fontSize: 10,
    marginTop: 2,
  },
});

// ─── Button section ───────────────────────────────────────────────────────────

const whiteArrowL = <Ionicons name="arrow-back"    size={20} color={Colors.text.negative} />;
const whiteArrowR = <Ionicons name="arrow-forward" size={20} color={Colors.text.negative} />;
const darkArrowL  = <Ionicons name="arrow-back"    size={20} color={Colors.icon.default}  />;
const darkArrowR  = <Ionicons name="arrow-forward" size={20} color={Colors.icon.default}  />;
const dimArrowL   = <Ionicons name="arrow-back"    size={20} color={Colors.text.disabled} />;
const dimArrowR   = <Ionicons name="arrow-forward" size={20} color={Colors.text.disabled} />;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ShowcaseScreen() {
  return (
    <SafeAreaView style={screen.safe}>
      <ScrollView
        style={screen.scroll}
        contentContainerStyle={screen.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={screen.header}>
          <Text style={screen.headerTitle}>Design System Showcase</Text>
          <Text style={screen.headerSub}>TMA · Colors · Typography · Components</Text>
        </View>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TYPOGRAPHY                                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Typography" />

        <GroupLabel label="English" />
        {ENGLISH_SAMPLES.map((s) => (
          <TypeRow key={s.label} {...s} />
        ))}

        <GroupLabel label="Arabic" style={{ marginTop: 24 } as any} />
        {ARABIC_SAMPLES.map((s) => (
          <TypeRow key={s.label} {...s} />
        ))}

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* COLORS                                                            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Colors" />

        {COLOR_GROUPS.map(({ group, swatches }) => (
          <View key={group} style={colorSection.group}>
            <GroupLabel label={group} />
            <View style={colorSection.grid}>
              {swatches.map((s) => (
                <SwatchCard key={s.name} {...s} />
              ))}
            </View>
          </View>
        ))}

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* BUTTON                                                            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Button" />

        {/* Variants – size L */}
        <GroupLabel label="Variants · Size L · Default" />
        <View style={btn.stack}>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Primary</Text>
            <Button label="Button" variant="primary"   size="L" leftIcon={whiteArrowL} rightIcon={whiteArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Secondary</Text>
            <Button label="Button" variant="secondary" size="L" leftIcon={darkArrowL}  rightIcon={darkArrowR}  style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Tertiary</Text>
            <Button label="Button" variant="tertiary"  size="L" leftIcon={darkArrowL}  rightIcon={darkArrowR}  style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Correct</Text>
            <Button label="Button" variant="correct"   size="L" leftIcon={whiteArrowL} rightIcon={whiteArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Wrong</Text>
            <Button label="Button" variant="wrong"     size="L" leftIcon={whiteArrowL} rightIcon={whiteArrowR} style={btn.fill} />
          </View>
        </View>

        {/* Sizes – primary */}
        <GroupLabel label="Sizes · Primary · With Icons" />
        <View style={btn.stack}>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>L · 64px</Text>
            <Button label="Button" variant="primary" size="L" leftIcon={whiteArrowL} rightIcon={whiteArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>M · 56px</Text>
            <Button label="Button" variant="primary" size="M" leftIcon={whiteArrowL} rightIcon={whiteArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>S · 48px</Text>
            <Button label="Button" variant="primary" size="S" leftIcon={whiteArrowL} rightIcon={whiteArrowR} style={btn.fill} />
          </View>
        </View>

        {/* Icon combinations */}
        <GroupLabel label="Icon Combinations · Primary L" />
        <View style={btn.stack}>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Both</Text>
            <Button label="Button" variant="primary" size="L" leftIcon={whiteArrowL} rightIcon={whiteArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Left only</Text>
            <Button label="Button" variant="primary" size="L" leftIcon={whiteArrowL}                         style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Right only</Text>
            <Button label="Button" variant="primary" size="L"                        rightIcon={whiteArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>No icons</Text>
            <Button label="Button" variant="primary" size="L"                                                style={btn.fill} />
          </View>
        </View>

        {/* Disabled – all variants */}
        <GroupLabel label="Disabled · All Variants · Size L" />
        <View style={btn.stack}>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Primary</Text>
            <Button label="Button" variant="primary"   size="L" disabled leftIcon={dimArrowL} rightIcon={dimArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Secondary</Text>
            <Button label="Button" variant="secondary" size="L" disabled leftIcon={dimArrowL} rightIcon={dimArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Tertiary</Text>
            <Button label="Button" variant="tertiary"  size="L" disabled leftIcon={dimArrowL} rightIcon={dimArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Correct</Text>
            <Button label="Button" variant="correct"   size="L" disabled leftIcon={dimArrowL} rightIcon={dimArrowR} style={btn.fill} />
          </View>
          <View style={btn.row}>
            <Text style={btn.rowLabel}>Wrong</Text>
            <Button label="Button" variant="wrong"     size="L" disabled leftIcon={dimArrowL} rightIcon={dimArrowR} style={btn.fill} />
          </View>
        </View>

        <View style={screen.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const screen = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface.subtle,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 36,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  headerTitle: {
    ...Typography.english.heading.h1,
    color: Colors.text.heading,
  },
  headerSub: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
    marginTop: 6,
  },
  bottomPad: {
    height: 60,
  },
});

const colorSection = StyleSheet.create({
  group: {
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

const btn = StyleSheet.create({
  stack: {
    gap: 10,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
    width: 72,
    fontSize: 11,
  },
  fill: {
    flex: 1,
  },
});
