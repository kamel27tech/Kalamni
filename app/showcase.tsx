import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/atoms/Button';
import { Icon, IconName } from '@/components/atoms/Icon';
import HeaderActivity from '@/components/molecules/HeaderActivity';
import PromptCard from '@/components/molecules/PromptCard';
import AnswerOption from '@/components/molecules/AnswerOption';
import FeedbackContainer from '@/components/molecules/FeedbackContainer';
import MultipleChoiceExercise from '@/components/exercises/MultipleChoiceExercise';
import ProgressBar from '@/components/atoms/ProgressBar';
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

// ─── Icon section ─────────────────────────────────────────────────────────────

const ICON_SAMPLES: { name: IconName }[] = [
  { name: 'close' },
  { name: 'arrow_forward' },
  { name: 'arrow_back' },
  { name: 'check' },
  { name: 'check_circle' },
  { name: 'volume_up' },
  { name: 'play_arrow' },
  { name: 'settings' },
  { name: 'person' },
  { name: 'home' },
];

// ─── Button section ───────────────────────────────────────────────────────────

const whiteArrowL = <Ionicons name="arrow-back"    size={20} color={Colors.text.negative} />;
const whiteArrowR = <Ionicons name="arrow-forward" size={20} color={Colors.text.negative} />;
const darkArrowL  = <Ionicons name="arrow-back"    size={20} color={Colors.icon.default}  />;
const darkArrowR  = <Ionicons name="arrow-forward" size={20} color={Colors.icon.default}  />;
const dimArrowL   = <Ionicons name="arrow-back"    size={20} color={Colors.text.disabled} />;
const dimArrowR   = <Ionicons name="arrow-forward" size={20} color={Colors.text.disabled} />;

// ─── Progress Bar section ─────────────────────────────────────────────────────

const STATIC_SAMPLES: { progress: number; label: string }[] = [
  { progress: 0,    label: '0' },
  { progress: 0.25, label: '0.25' },
  { progress: 0.5,  label: '0.5' },
  { progress: 0.75, label: '0.75' },
  { progress: 1.0,  label: '1.0' },
];

function AnimatedProgressDemo() {
  const [value, setValue] = useState(0);

  function increment() {
    setValue((prev) => Math.min(1, parseFloat((prev + 0.2).toFixed(2))));
  }

  return (
    <View style={pb.demoCard}>
      <ProgressBar progress={value} style={{ marginBottom: 8 }} />
      <Text style={pb.demoValue}>{(value * 100).toFixed(0)}%</Text>
      <TouchableOpacity onPress={increment} style={pb.demoButton}>
        <Text style={pb.demoButtonLabel}>+0.2</Text>
      </TouchableOpacity>
    </View>
  );
}

const pb = StyleSheet.create({
  row: {
    marginBottom: 16,
  },
  caption: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
    fontSize: 11,
    marginTop: 6,
  },
  demoCard: {
    gap: 12,
  },
  demoValue: {
    ...Typography.english.title.s,
    color: Colors.text.body,
  },
  demoButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  demoButtonLabel: {
    ...Typography.english.title.s,
    color: Colors.text.negative,
  },
});

// ─── Answer Option section ────────────────────────────────────────────────────

const SHOWCASE_IMAGE = require('@/assets/images/icon.png');

function AnswerOptionToggleDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <AnswerOption
      state={selected ? 'selected' : 'default'}
      text="الرياض"
      transliteration="ar-Riyadh"
      onPress={() => setSelected((s) => !s)}
    />
  );
}

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

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* PROGRESS BAR                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Progress Bar" />

        <GroupLabel label="Static values" />
        {STATIC_SAMPLES.map(({ progress, label }) => (
          <View key={label} style={pb.row}>
            <ProgressBar progress={progress} animated={false} />
            <Text style={pb.caption}>{label}</Text>
          </View>
        ))}

        <GroupLabel label="Animated (tap to increment)" />
        <AnimatedProgressDemo />

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ICONS                                                             */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Icons" />

        <GroupLabel label="Common icons · default color · 28px" />
        <View style={icons.grid}>
          {ICON_SAMPLES.map(({ name }) => (
            <View key={name} style={icons.cell}>
              <Icon name={name} size={28} />
              <Text style={icons.label}>{name}</Text>
            </View>
          ))}
        </View>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* HEADER ACTIVITY                                                   */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Header Activity" />

        <GroupLabel label="1 · Default — progress 25%, step 2/40, translate" />
        <View style={ha.card}>
          <HeaderActivity
            progress={0.25}
            currentStep={2}
            totalSteps={40}
            onClose={() => console.log('close pressed')}
          />
        </View>

        <GroupLabel label="2 · Without stepper — showStepper false, progress 50%" />
        <View style={ha.card}>
          <HeaderActivity
            progress={0.5}
            showStepper={false}
            onClose={() => console.log('close pressed')}
          />
        </View>

        <GroupLabel label="3 · Different icon — flag, progress 75%" />
        <View style={ha.card}>
          <HeaderActivity
            progress={0.75}
            currentStep={30}
            totalSteps={40}
            rightIconName="flag"
            onClose={() => console.log('close pressed')}
          />
        </View>

        <GroupLabel label="4 · Interactive — both handlers active, progress 10%" />
        <View style={ha.card}>
          <HeaderActivity
            progress={0.1}
            currentStep={1}
            totalSteps={40}
            onClose={() => console.log('close pressed')}
            onRightIconPress={() => console.log('right icon pressed')}
          />
        </View>

        <GroupLabel label="5 · Near complete — progress 95%, step 38/40" />
        <View style={ha.card}>
          <HeaderActivity
            progress={0.95}
            currentStep={38}
            totalSteps={40}
            onClose={() => console.log('close pressed')}
          />
        </View>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* PROMPT CARD                                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Prompt Card" />

        <GroupLabel label="1 · Short question" />
        <View style={prompt.frame}>
          <PromptCard text="ما هي عاصمة السعودية؟" />
        </View>

        <GroupLabel label="2 · Vocabulary question" />
        <View style={prompt.frame}>
          <PromptCard text="ما جمع كلمة كتاب؟" />
        </View>

        <GroupLabel label="3 · Long prompt (text wrapping)" />
        <View style={prompt.frame}>
          <PromptCard text="اختر الجملة الصحيحة التي تصف ما يفعله الطالب في الفصل الدراسي كل يوم." />
        </View>

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ANSWER OPTION                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Answer Option" />

        <GroupLabel label="Text · 1 · Default — الرياض" />
        <AnswerOption
          state="default"
          text="الرياض"
          transliteration="ar-Riyadh"
          onPress={() => console.log('pressed')}
          style={ao.item}
        />

        <GroupLabel label="Text · 2 · Selected — دبي" />
        <AnswerOption
          state="selected"
          text="دبي"
          transliteration="Dubai"
          onPress={() => console.log('pressed')}
          style={ao.item}
        />

        <GroupLabel label="Text · 3 · Wrong — أبو ظبي" />
        <AnswerOption
          state="wrong"
          text="أبو ظبي"
          transliteration="Abu Dhabi"
          onPress={() => console.log('pressed')}
          style={ao.item}
        />

        <GroupLabel label="Image · 4 · Default" />
        <View style={ao.imageWrap}>
          <AnswerOption
            state="default"
            image={SHOWCASE_IMAGE}
            imageAlt="Placeholder image"
            onPress={() => console.log('pressed')}
          />
        </View>

        <GroupLabel label="Image · 5 · Selected" />
        <View style={ao.imageWrap}>
          <AnswerOption
            state="selected"
            image={SHOWCASE_IMAGE}
            imageAlt="Placeholder image"
            onPress={() => console.log('pressed')}
          />
        </View>

        <GroupLabel label="Image · 6 · Wrong" />
        <View style={ao.imageWrap}>
          <AnswerOption
            state="wrong"
            image={SHOWCASE_IMAGE}
            imageAlt="Placeholder image"
            onPress={() => console.log('pressed')}
          />
        </View>

        <GroupLabel label="Interactive · Tap to toggle" />
        <AnswerOptionToggleDemo />

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* FEEDBACK CONTAINER                                                */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Feedback Container" />

        <GroupLabel label="1 · Default — disabled button only" />
        <FeedbackContainer state="default" style={fb.item} />

        <GroupLabel label="2 · Correct — default message" />
        <FeedbackContainer
          state="correct"
          onNext={() => console.log('next pressed')}
          style={fb.item}
        />

        <GroupLabel label="3 · Wrong — short answer" />
        <FeedbackContainer
          state="wrong"
          correctAnswer="الرياض"
          onNext={() => console.log('next pressed')}
          style={fb.item}
        />

        <GroupLabel label="4 · Wrong — long answer (text wrapping)" />
        <FeedbackContainer
          state="wrong"
          correctAnswer="أنا أتعلم اللغة العربية لأني أريد أن أتحدث بشكل أفضل وأفهم أصدقائي الثقافة"
          onNext={() => console.log('next pressed')}
          style={fb.item}
        />

        <GroupLabel label="5 · Correct — custom message" />
        <FeedbackContainer
          state="correct"
          successMessage="Perfect! Keep it up!"
          onNext={() => console.log('next pressed')}
          style={fb.item}
        />

        <Divider />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* MULTIPLE CHOICE EXERCISE                                           */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <SectionTitle title="Multiple Choice Exercise" />

        <GroupLabel label="1 · Default — no answer selected" />
        <View style={mce.container}>
          <MultipleChoiceExercise
            data={{
              prompt: 'ما هي عاصمة السعودية؟',
              correctAnswer: 'الرياض',
              options: [
                { text: 'الرياض', transliteration: 'Ar-Riyadh' },
                { text: 'جدة', transliteration: 'Jeddah' },
                { text: 'الدمام', transliteration: 'Ad-Dammam' },
                { text: 'مكة', transliteration: 'Makkah' },
              ],
            }}
            selectedAnswer={null}
            isLocked={false}
            onSelect={() => console.log('selected')}
          />
        </View>

        <GroupLabel label="2 · Answer selected, not checked" />
        <View style={mce.container}>
          <MultipleChoiceExercise
            data={{
              prompt: 'ما هي عاصمة السعودية؟',
              correctAnswer: 'الرياض',
              options: [
                { text: 'الرياض', transliteration: 'Ar-Riyadh' },
                { text: 'جدة', transliteration: 'Jeddah' },
                { text: 'الدمام', transliteration: 'Ad-Dammam' },
                { text: 'مكة', transliteration: 'Makkah' },
              ],
            }}
            selectedAnswer="الرياض"
            isLocked={false}
            onSelect={() => console.log('selected')}
          />
        </View>

        <GroupLabel label="3 · Correct — locked, feedback visible" />
        <View style={mce.container}>
          <MultipleChoiceExercise
            data={{
              prompt: 'ما هي عاصمة السعودية؟',
              correctAnswer: 'الرياض',
              options: [
                { text: 'الرياض', transliteration: 'Ar-Riyadh' },
                { text: 'جدة', transliteration: 'Jeddah' },
                { text: 'الدمام', transliteration: 'Ad-Dammam' },
                { text: 'مكة', transliteration: 'Makkah' },
              ],
            }}
            selectedAnswer="الرياض"
            isLocked={true}
            onSelect={() => console.log('next pressed')}
          />
        </View>

        <GroupLabel label="4 · Wrong — locked, correct answer shown" />
        <View style={mce.container}>
          <MultipleChoiceExercise
            data={{
              prompt: 'ما هي عاصمة السعودية؟',
              correctAnswer: 'الرياض',
              options: [
                { text: 'الرياض', transliteration: 'Ar-Riyadh' },
                { text: 'جدة', transliteration: 'Jeddah' },
                { text: 'الدمام', transliteration: 'Ad-Dammam' },
                { text: 'مكة', transliteration: 'Makkah' },
              ],
            }}
            selectedAnswer="جدة"
            isLocked={true}
            onSelect={() => console.log('next pressed')}
          />
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

const ha = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface.subtle,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
});

const icons = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  cell: {
    width: 72,
    alignItems: 'center',
    gap: 6,
  },
  label: {
    ...Typography.english.body.m,
    color: Colors.text.caption,
    fontSize: 10,
    textAlign: 'center',
  },
});

const ao = StyleSheet.create({
  item: {
    marginBottom: 24,
  },
  imageWrap: {
    width: 140,
    marginBottom: 24,
  },
});

const prompt = StyleSheet.create({
  frame: {
    backgroundColor: Colors.surface.default,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
});

const fb = StyleSheet.create({
  item: {
    marginBottom: 24,
  },
});

const mce = StyleSheet.create({
  container: {
    height: 500,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 12,
    overflow: 'hidden',
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
