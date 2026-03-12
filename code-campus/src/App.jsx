import { useState } from 'react'
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarRange,
  ChartColumnIncreasing,
  CircleGauge,
  ClipboardPenLine,
  Landmark,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress, ProgressLabel } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const scoreLabels = [
  { value: '1', label: 'Needs attention' },
  { value: '2', label: 'Developing' },
  { value: '3', label: 'Effective' },
  { value: '4', label: 'Strong' },
  { value: '5', label: 'Outstanding' },
]

const performanceAreas = [
  {
    key: 'strategy',
    title: 'Strategic oversight',
    description: 'Challenges management appropriately and keeps long-range priorities visible.',
    icon: ChartColumnIncreasing,
  },
  {
    key: 'governance',
    title: 'Governance discipline',
    description: 'Upholds fiduciary standards, ethics, and committee responsibilities.',
    icon: ShieldCheck,
  },
  {
    key: 'engagement',
    title: 'Board engagement',
    description: 'Arrives prepared, contributes constructively, and builds alignment in session.',
    icon: Users,
  },
  {
    key: 'industry',
    title: 'Sector insight',
    description: 'Brings current market, policy, or operational perspective to board decisions.',
    icon: Landmark,
  },
  {
    key: 'leadership',
    title: 'Independent leadership',
    description: 'Demonstrates sound judgement, candor, and respect when stakes are high.',
    icon: BriefcaseBusiness,
  },
]

const developmentThemes = [
  'Committee rotation',
  'Regulatory updates',
  'Risk oversight coaching',
  'Succession planning focus',
]

const initialState = {
  boardMember: '',
  role: '',
  evaluator: '',
  committee: '',
  cycle: '',
  attendance: '',
  tenure: '',
  recommendation: '',
  strategicWins: '',
  cultureNote: '',
  boardChairNote: '',
  developmentPriorities: [],
  scores: {
    strategy: '',
    governance: '',
    engagement: '',
    industry: '',
    leadership: '',
  },
}

function buildSubmissionPayload(formState) {
  const numericScores = Object.fromEntries(
    Object.entries(formState.scores).map(([key, value]) => [key, Number(value)]),
  )
  const scoreValues = Object.values(numericScores)
  const averageScore = scoreValues.length
    ? Number((scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length).toFixed(1))
    : 0
  const highPriorityFlags = scoreValues.filter((value) => value <= 2).length

  const completedFields = [
    formState.boardMember,
    formState.role,
    formState.evaluator,
    formState.committee,
    formState.cycle,
    formState.attendance,
    formState.tenure,
    formState.recommendation,
    formState.strategicWins,
    formState.cultureNote,
    formState.boardChairNote,
    ...Object.values(formState.scores),
  ].filter(Boolean).length

  return {
    boardMember: formState.boardMember.trim(),
    role: formState.role.trim(),
    evaluator: formState.evaluator.trim(),
    committee: formState.committee,
    cycle: formState.cycle.trim(),
    attendance: formState.attendance.trim(),
    tenure: formState.tenure.trim(),
    recommendation: formState.recommendation,
    strategicWins: formState.strategicWins.trim(),
    cultureNote: formState.cultureNote.trim(),
    boardChairNote: formState.boardChairNote.trim(),
    developmentPriorities: formState.developmentPriorities,
    scores: numericScores,
    averageScore,
    highPriorityFlags,
    completion: Math.round((completedFields / 16) * 100),
  }
}

function App() {
  const [form, setForm] = useState(initialState)
  const [submittedAt, setSubmittedAt] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const completedFields = [
    form.boardMember,
    form.role,
    form.evaluator,
    form.committee,
    form.cycle,
    form.attendance,
    form.tenure,
    form.recommendation,
    form.strategicWins,
    form.cultureNote,
    form.boardChairNote,
    ...Object.values(form.scores),
  ].filter(Boolean).length

  const totalFields = 16
  const completion = Math.round((completedFields / totalFields) * 100)
  const numericScores = Object.values(form.scores)
    .filter(Boolean)
    .map((value) => Number(value))
  const averageScore = numericScores.length
    ? (numericScores.reduce((sum, value) => sum + value, 0) / numericScores.length).toFixed(1)
    : '0.0'
  const highPriorityFlags = numericScores.filter((value) => value <= 2).length

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateScore(key, value) {
    setForm((current) => ({
      ...current,
      scores: {
        ...current.scores,
        [key]: value,
      },
    }))
  }

  function toggleDevelopmentPriority(item, checked) {
    setForm((current) => ({
      ...current,
      developmentPriorities: checked
        ? [...current.developmentPriorities, item]
        : current.developmentPriorities.filter((entry) => entry !== item),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const payload = buildSubmissionPayload(form)

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitMessage('')

    try {
      const response = await fetch('http://localhost:5001/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save appraisal.')
      }

      setSubmittedAt(
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date()),
      )
      setSubmitMessage('Appraisal saved to the backend successfully.')
    } catch (error) {
      setSubmitError(error.message || 'Unable to save appraisal.')
      setSubmittedAt(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setForm(initialState)
    setSubmittedAt(null)
    setSubmitError('')
    setSubmitMessage('')
  }

  return (
    <main className="px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="border border-white/60 bg-[linear-gradient(135deg,rgba(255,250,242,0.96),rgba(247,238,224,0.86))] shadow-[0_30px_80px_-48px_rgba(32,24,17,0.55)]">
          <CardHeader className="gap-4 md:grid-cols-[1.4fr_auto]">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-primary-foreground px-3 py-1 text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                Board Excellence Review
              </div>
              <div className="space-y-3">
                <CardTitle className="max-w-3xl text-4xl leading-none md:text-5xl">
                  Board member appraisal form built for governance-focused review cycles.
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7 text-muted-foreground">
                  Capture performance signals, document committee impact, and record clear
                  recommendations for reappointment or development support.
                </CardDescription>
              </div>
            </div>
            <CardAction className="w-full self-stretch md:w-[19rem]">
              <div className="grid h-full gap-3 rounded-2xl border border-foreground/8 bg-[#183a35] p-4 text-[#f4f7f2]">
                <StatTile icon={CircleGauge} label="Completion" value={`${completion}%`} />
                <StatTile icon={BadgeCheck} label="Average score" value={averageScore} />
                <StatTile
                  icon={ClipboardPenLine}
                  label="High-priority flags"
                  value={String(highPriorityFlags)}
                />
              </div>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex flex-wrap items-center gap-3 border-none bg-transparent pt-0">
            <Tag>Annual appraisal</Tag>
            <Tag>Committee-ready summary</Tag>
            <Tag>Mobile responsive</Tag>
            <Tag>shadcn + Tailwind + Lucide</Tag>
          </CardFooter>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Card className="border border-white/70 bg-card/90 shadow-[0_24px_60px_-45px_rgba(32,24,17,0.55)] backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CalendarRange className="size-5 text-primary" />
                  Appraisal context
                </CardTitle>
                <CardDescription>
                  Start with the board member, evaluation period, and committee setting.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Board member">
                  <Input
                    placeholder="Amina Okafor"
                    value={form.boardMember}
                    onChange={(event) => updateField('boardMember', event.target.value)}
                  />
                </Field>
                <Field label="Board role">
                  <Input
                    placeholder="Independent Non-Executive Director"
                    value={form.role}
                    onChange={(event) => updateField('role', event.target.value)}
                  />
                </Field>
                <Field label="Evaluator">
                  <Input
                    placeholder="Governance Committee Chair"
                    value={form.evaluator}
                    onChange={(event) => updateField('evaluator', event.target.value)}
                  />
                </Field>
                <Field label="Review cycle">
                  <Input
                    placeholder="FY 2025 annual cycle"
                    value={form.cycle}
                    onChange={(event) => updateField('cycle', event.target.value)}
                  />
                </Field>
                <Field label="Primary committee">
                  <Select value={form.committee} onValueChange={(value) => updateField('committee', value ?? '')}>
                    <SelectTrigger className="h-10 w-full rounded-xl bg-white/70 px-3">
                      <SelectValue placeholder="Select committee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="audit-risk">Audit & Risk</SelectItem>
                      <SelectItem value="governance">Governance & Nominations</SelectItem>
                      <SelectItem value="remuneration">Remuneration</SelectItem>
                      <SelectItem value="strategy">Strategy & Innovation</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Attendance record">
                  <Input
                    placeholder="11 of 12 meetings attended"
                    value={form.attendance}
                    onChange={(event) => updateField('attendance', event.target.value)}
                  />
                </Field>
                <Field className="md:col-span-2" label="Tenure and succession note">
                  <Input
                    placeholder="Third term under review; mentoring incoming committee vice-chair"
                    value={form.tenure}
                    onChange={(event) => updateField('tenure', event.target.value)}
                  />
                </Field>
              </CardContent>
            </Card>

            <Card className="border border-white/70 bg-card/90 shadow-[0_24px_60px_-45px_rgba(32,24,17,0.55)] backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CircleGauge className="size-5 text-primary" />
                  Performance dimensions
                </CardTitle>
                <CardDescription>
                  Rate each area from 1 to 5 based on evidence from meetings, committee work,
                  and stakeholder feedback.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 rounded-2xl border border-dashed border-border/80 bg-background/60 p-4 text-sm text-muted-foreground md:grid-cols-5">
                  {scoreLabels.map((item) => (
                    <div key={item.value} className="rounded-xl bg-white/80 px-3 py-2 text-center">
                      <div className="text-lg font-semibold text-foreground">{item.value}</div>
                      <div>{item.label}</div>
                    </div>
                  ))}
                </div>

                {performanceAreas.map((area) => {
                  const AreaIcon = area.icon

                  return (
                    <div
                      key={area.key}
                      className="rounded-3xl border border-border/70 bg-white/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                    >
                      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <AreaIcon className="size-4" />
                            </div>
                            <h3 className="text-xl">{area.title}</h3>
                          </div>
                          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            {area.description}
                          </p>
                        </div>
                        <div className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                          Weighted equally
                        </div>
                      </div>

                      <RadioGroup
                        className="grid gap-3 md:grid-cols-5"
                        value={form.scores[area.key]}
                        onValueChange={(value) => updateScore(area.key, value ?? '')}
                      >
                        {scoreLabels.map((score) => (
                          <Label
                            key={score.value}
                            className={cn(
                              'flex cursor-pointer flex-col items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 transition hover:border-primary/35 hover:bg-primary-foreground',
                              form.scores[area.key] === score.value &&
                                'border-primary bg-primary text-primary-foreground',
                            )}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span className="text-sm font-semibold">{score.label}</span>
                              <RadioGroupItem value={score.value} />
                            </div>
                            <span className="text-3xl font-semibold leading-none">
                              {score.value}
                            </span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="border border-white/70 bg-card/90 shadow-[0_24px_60px_-45px_rgba(32,24,17,0.55)] backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Landmark className="size-5 text-primary" />
                  Qualitative board notes
                </CardTitle>
                <CardDescription>
                  Document the most visible strategic wins, boardroom conduct, and chairman
                  observations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Most meaningful strategic contribution">
                  <Textarea
                    placeholder="Examples: capital allocation discipline, CEO challenge, digital transformation advocacy..."
                    value={form.strategicWins}
                    onChange={(event) => updateField('strategicWins', event.target.value)}
                  />
                </Field>
                <Field label="Board culture and collaboration">
                  <Textarea
                    placeholder="Describe how the member influences tone, trust, candor, and cross-committee coordination."
                    value={form.cultureNote}
                    onChange={(event) => updateField('cultureNote', event.target.value)}
                  />
                </Field>
                <Field label="Chair or governance lead comment">
                  <Textarea
                    placeholder="Summarize the key conclusion from the chair's perspective."
                    value={form.boardChairNote}
                    onChange={(event) => updateField('boardChairNote', event.target.value)}
                  />
                </Field>
              </CardContent>
            </Card>

            <Card className="border border-white/70 bg-card/90 shadow-[0_24px_60px_-45px_rgba(32,24,17,0.55)] backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <BadgeCheck className="size-5 text-primary" />
                  Recommendation
                </CardTitle>
                <CardDescription>
                  Conclude with a clear board recommendation and any development support to pair
                  with it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Field label="Reappointment outcome">
                  <RadioGroup
                    className="grid gap-3 md:grid-cols-3"
                    value={form.recommendation}
                    onValueChange={(value) => updateField('recommendation', value ?? '')}
                  >
                    {[
                      ['reappoint', 'Reappoint'],
                      ['reappoint-support', 'Reappoint with development plan'],
                      ['defer', 'Defer pending review'],
                    ].map(([value, label]) => (
                      <Label
                        key={value}
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-2xl border border-border/70 bg-white/75 p-4',
                          form.recommendation === value && 'border-primary bg-primary/8',
                        )}
                      >
                        <span>{label}</span>
                        <RadioGroupItem value={value} />
                      </Label>
                    ))}
                  </RadioGroup>
                </Field>

                <div className="space-y-3">
                  <Label>Suggested development priorities</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {developmentThemes.map((item) => (
                      <Label
                        key={item}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3"
                      >
                        <Checkbox
                          checked={form.developmentPriorities.includes(item)}
                          onCheckedChange={(checked) =>
                            toggleDevelopmentPriority(item, Boolean(checked))
                          }
                        />
                        <span>{item}</span>
                      </Label>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch justify-between gap-3 border-t border-border/60 bg-muted/35 md:flex-row">
                <Button type="button" variant="outline" size="lg" onClick={handleReset}>
                  Reset form
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="shadow-[0_18px_30px_-18px_rgba(15,108,91,0.8)]"
                >
                  {isSubmitting ? 'Saving...' : 'Save appraisal draft'}
                </Button>
              </CardFooter>
            </Card>
          </form>

          <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <Card className="border border-[#204942]/10 bg-[#163731] text-[#f3f5ee] shadow-[0_30px_80px_-48px_rgba(22,55,49,0.9)]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#f8f4ea]">Review snapshot</CardTitle>
                <CardDescription className="text-[#d9e3dc]">
                  Live summary of completeness and overall judgement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <Progress value={completion}>
                  <ProgressLabel className="text-[#f8f4ea]">Form completion</ProgressLabel>
                  <div className="ml-auto text-sm text-[#d9e3dc]">{completion}%</div>
                </Progress>

                <Separator className="bg-white/10" />

                <SummaryRow label="Board member" value={form.boardMember || 'Not entered'} />
                <SummaryRow label="Committee" value={form.committee || 'Not selected'} />
                <SummaryRow label="Average score" value={averageScore} />
                <SummaryRow
                  label="Recommendation"
                  value={
                    form.recommendation
                      ? form.recommendation.replaceAll('-', ' ')
                      : 'Pending recommendation'
                  }
                />
                <SummaryRow
                  label="Development themes"
                  value={
                    form.developmentPriorities.length
                      ? form.developmentPriorities.join(', ')
                      : 'No development priorities selected'
                  }
                />
              </CardContent>
            </Card>

            <Card className="border border-white/70 bg-card/85">
              <CardHeader>
                <CardTitle className="text-xl">Review checklist</CardTitle>
                <CardDescription>
                  Use these prompts before presenting to the nominations or governance committee.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Confirm meeting attendance against the board calendar.',
                  'Cross-check the rating narrative with committee chair feedback.',
                  'Document any reappointment conditions clearly.',
                  'Capture at least one development action if score is below 3.0.',
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-background/80 p-3">
                    <div className="mt-0.5 rounded-full bg-accent/20 p-1 text-accent-foreground">
                      <BadgeCheck className="size-3.5" />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {submitError ? (
              <Card className="border border-destructive/20 bg-[#fff3f1]">
                <CardHeader>
                  <CardTitle className="text-xl text-destructive">Save failed</CardTitle>
                  <CardDescription>{submitError}</CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {submittedAt ? (
              <Card className="border border-primary/20 bg-primary-foreground/90">
                <CardHeader>
                  <CardTitle className="text-xl">Draft saved</CardTitle>
                  <CardDescription>
                    {submitMessage || 'The appraisal was saved to the backend.'} on {submittedAt}.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  )
}

function Field({ children, className, label }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
      <div className="mb-2 flex items-center gap-2 text-[#dce6df]">
        <Icon className="size-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-3xl font-semibold text-[#fffaf2]">{value}</div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium tracking-[0.18em] text-[#d9e3dc] uppercase">{label}</div>
      <div className="text-sm leading-6 text-[#f8f4ea]">{value}</div>
    </div>
  )
}

function Tag({ children }) {
  return (
    <div className="rounded-full border border-border/70 bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </div>
  )
}

export default App
