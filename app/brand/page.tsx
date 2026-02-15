'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ColorSwatchProps {
  name: string;
  variable: string;
  bgClass: string;
  textClass?: string;
  description?: string;
}

function ColorSwatch({ name, variable, bgClass, textClass, description }: ColorSwatchProps) {
  return (
    <div className="space-y-2">
      <div
        className={`h-20 rounded-lg border ${bgClass} flex items-center justify-center`}
      >
        {textClass && (
          <span className={`text-sm font-medium ${textClass}`}>Aa</span>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="font-medium text-sm text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{variable}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

interface ColorPairProps {
  name: string;
  bgVariable: string;
  fgVariable: string;
  bgClass: string;
  fgClass: string;
  description?: string;
}

function ColorPair({ name, bgVariable, fgVariable, bgClass, fgClass, description }: ColorPairProps) {
  return (
    <div className="space-y-2">
      <div
        className={`h-24 rounded-lg border ${bgClass} flex items-center justify-center p-4`}
      >
        <span className={`text-lg font-semibold ${fgClass}`}>
          {name}
        </span>
      </div>
      <div className="space-y-0.5">
        <p className="font-medium text-sm text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{bgVariable}</p>
        <p className="text-xs text-muted-foreground font-mono">{fgVariable}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function BrandDemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 md:px-8 lg:px-12">
          <h1 className="text-xl font-bold font-heading text-foreground">Brand Colors</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-10 px-6 md:px-8 lg:px-12 space-y-12">
        {/* Introduction */}
        <section className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground">Design System Colors</h2>
          <p className="text-muted-foreground text-lg">
            This page showcases all semantic color tokens defined in <code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">globals.css</code>. 
            Use the theme toggle above to see how colors adapt between light and dark modes.
          </p>
        </section>

        <Separator />

        {/* Core Colors */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold font-heading text-foreground">Core Colors</h3>
            <p className="text-muted-foreground mt-1">Primary semantic colors used throughout the application</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <ColorPair
              name="Background"
              bgVariable="--background"
              fgVariable="--foreground"
              bgClass="bg-background"
              fgClass="text-foreground"
              description="Page background"
            />
            <ColorPair
              name="Primary"
              bgVariable="--primary"
              fgVariable="--primary-foreground"
              bgClass="bg-primary"
              fgClass="text-primary-foreground"
              description="Primary actions"
            />
            <ColorPair
              name="Secondary"
              bgVariable="--secondary"
              fgVariable="--secondary-foreground"
              bgClass="bg-secondary"
              fgClass="text-secondary-foreground"
              description="Secondary actions"
            />
            <ColorPair
              name="Muted"
              bgVariable="--muted"
              fgVariable="--muted-foreground"
              bgClass="bg-muted"
              fgClass="text-muted-foreground"
              description="Subtle backgrounds"
            />
            <ColorPair
              name="Accent"
              bgVariable="--accent"
              fgVariable="--accent-foreground"
              bgClass="bg-accent"
              fgClass="text-accent-foreground"
              description="Accent highlights"
            />
          </div>
        </section>

        <Separator />

        {/* Semantic Status Colors */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold font-heading text-foreground">Status Colors</h3>
            <p className="text-muted-foreground mt-1">Colors for feedback and status indicators</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <ColorPair
              name="Destructive"
              bgVariable="--destructive"
              fgVariable="--destructive-foreground"
              bgClass="bg-destructive"
              fgClass="text-destructive-foreground"
              description="Errors & danger"
            />
            <ColorPair
              name="Success"
              bgVariable="--success"
              fgVariable="--success-foreground"
              bgClass="bg-success"
              fgClass="text-success-foreground"
              description="Success states"
            />
            <ColorPair
              name="Warning"
              bgVariable="--warning"
              fgVariable="--warning-foreground"
              bgClass="bg-warning"
              fgClass="text-warning-foreground"
              description="Warnings & caution"
            />
          </div>
        </section>

        <Separator />

        {/* Surface Colors */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold font-heading text-foreground">Surface Colors</h3>
            <p className="text-muted-foreground mt-1">Colors for cards, popovers, and elevated surfaces</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <ColorPair
              name="Card"
              bgVariable="--card"
              fgVariable="--card-foreground"
              bgClass="bg-card"
              fgClass="text-card-foreground"
              description="Card backgrounds"
            />
            <ColorPair
              name="Popover"
              bgVariable="--popover"
              fgVariable="--popover-foreground"
              bgClass="bg-popover"
              fgClass="text-popover-foreground"
              description="Dropdown menus"
            />
            <ColorSwatch
              name="Border"
              variable="--border"
              bgClass="bg-border"
              description="Default borders"
            />
            <ColorSwatch
              name="Input"
              variable="--input"
              bgClass="bg-input"
              description="Input borders"
            />
            <ColorSwatch
              name="Ring"
              variable="--ring"
              bgClass="bg-ring"
              description="Focus rings"
            />
          </div>
        </section>

        <Separator />

        {/* Chart Colors */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold font-heading text-foreground">Chart Colors</h3>
            <p className="text-muted-foreground mt-1">Colors for data visualization</p>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            <ColorSwatch
              name="Chart 1"
              variable="--chart-1"
              bgClass="bg-chart-1"
            />
            <ColorSwatch
              name="Chart 2"
              variable="--chart-2"
              bgClass="bg-chart-2"
            />
            <ColorSwatch
              name="Chart 3"
              variable="--chart-3"
              bgClass="bg-chart-3"
            />
            <ColorSwatch
              name="Chart 4"
              variable="--chart-4"
              bgClass="bg-chart-4"
            />
            <ColorSwatch
              name="Chart 5"
              variable="--chart-5"
              bgClass="bg-chart-5"
            />
          </div>
        </section>

        <Separator />

        {/* Sidebar Colors */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold font-heading text-foreground">Sidebar Colors</h3>
            <p className="text-muted-foreground mt-1">Dedicated colors for sidebar components</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <ColorPair
              name="Sidebar"
              bgVariable="--sidebar"
              fgVariable="--sidebar-foreground"
              bgClass="bg-sidebar"
              fgClass="text-sidebar-foreground"
            />
            <ColorPair
              name="Sidebar Primary"
              bgVariable="--sidebar-primary"
              fgVariable="--sidebar-primary-foreground"
              bgClass="bg-sidebar-primary"
              fgClass="text-sidebar-primary-foreground"
            />
            <ColorPair
              name="Sidebar Accent"
              bgVariable="--sidebar-accent"
              fgVariable="--sidebar-accent-foreground"
              bgClass="bg-sidebar-accent"
              fgClass="text-sidebar-accent-foreground"
            />
            <ColorSwatch
              name="Sidebar Border"
              variable="--sidebar-border"
              bgClass="bg-sidebar-border"
            />
          </div>
        </section>

        <Separator />

        {/* Typography */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold font-heading text-foreground">Typography</h3>
            <p className="text-muted-foreground mt-1">Font families defined in the theme</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Heading Font</CardTitle>
                <CardDescription className="font-mono text-xs">--font-heading</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-heading">The quick brown fox jumps over the lazy dog</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Body Font</CardTitle>
                <CardDescription className="font-mono text-xs">--font-body</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base font-body">The quick brown fox jumps over the lazy dog</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Mono Font</CardTitle>
                <CardDescription className="font-mono text-xs">--font-mono</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base font-mono">const greeting = &quot;Hello&quot;;</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Component Examples */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold font-heading text-foreground">Component Examples</h3>
            <p className="text-muted-foreground mt-1">See how colors apply to UI components</p>
          </div>
          
          {/* Buttons */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge className="bg-success text-success-foreground hover:bg-success/80">Success</Badge>
              <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">Warning</Badge>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Alerts</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a default alert using foreground colors.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>
                  This is a destructive alert for errors.
                </AlertDescription>
              </Alert>
              <Alert className="border-success bg-success/10 text-success [&>svg]:text-success">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success Alert</AlertTitle>
                <AlertDescription className="text-success/90">
                  This is a success alert using success colors.
                </AlertDescription>
              </Alert>
              <Alert className="border-warning bg-warning/10 text-warning [&>svg]:text-warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning Alert</AlertTitle>
                <AlertDescription className="text-warning/90">
                  This is a warning alert using warning colors.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Form Inputs</h4>
            <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-foreground">Cards</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Uses card background</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Card content goes here.</p>
                </CardContent>
              </Card>
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive">Destructive Card</CardTitle>
                  <CardDescription>For dangerous actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Warning content here.</p>
                </CardContent>
              </Card>
              <Card className="border-success/30 bg-success/5">
                <CardHeader>
                  <CardTitle className="text-success">Success Card</CardTitle>
                  <CardDescription>For positive feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Success content here.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center text-sm text-muted-foreground">
          <p>Edit colors in <code className="bg-muted px-1.5 py-0.5 rounded font-mono">app/globals.css</code></p>
        </footer>
      </main>
    </div>
  );
}
