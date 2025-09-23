"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { leadFormSchema, type LeadFormData } from "@/lib/validations"
import { formatPhoneNumber } from "@/lib/utils"

interface LeadFormProps {
  service?: string
  practice?: string
  className?: string
}

export function LeadForm({ service, practice, className }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      service,
      practice,
    },
  })

  const phoneValue = watch("phone")

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/forms/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Помилка відправки форми")
      }

      console.log("Lead submitted:", data)
      setShowSuccess(true)
      reset()
    } catch (error) {
      console.error("Form submission error:", error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue("phone", formatted)
  }

  return (
    <>
      <div className={`rounded-2xl border border-line bg-white/5 p-6 ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Безкоштовна консультація
          </h3>
          <p className="text-sm text-muted-foreground">
            Заповніть форму і наш юрист зв'яжеться з вами протягом 15 хвилин
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ім'я та прізвище *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Введіть ваше ім'я"
              className="bg-transparent border-line"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneValue || ""}
              onChange={handlePhoneChange}
              placeholder="+380 67 123 45 67"
              className="bg-transparent border-line"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Опишіть вашу ситуацію (необов'язково)</Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Розкажіть детально про вашу ситуацію..."
              rows={4}
              className="bg-transparent border-line resize-none"
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl"
            size="lg"
          >
            {isSubmitting ? "Відправляється..." : "Отримати консультацію"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Натискаючи кнопку, ви погоджуєтесь з{" "}
            <a href="/privacy" className="text-primary hover:underline">
              обробкою персональних даних
            </a>
          </p>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Дякуємо за звернення!
            </DialogTitle>
            <DialogDescription className="text-center">
              Ваша заявка прийнята. Наш юрист зв'яжеться з вами найближчим часом 
              для надання безкоштовної консультації.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={() => setShowSuccess(false)} className="rounded-xl">
              Зрозуміло
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}