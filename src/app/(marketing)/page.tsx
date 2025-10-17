import { Hero } from "@/components/blocks/hero"
import { Features } from "@/components/blocks/features"
import { Proof } from "@/components/blocks/proof"
import { CTA } from "@/components/blocks/cta"
import { Team } from "@/components/blocks/team"
import { Shield, Scale, Clock, Users } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      title: "Оскарження рішень ВЛК",
      description: "Професійне оскарження негативних рішень військово-лікарської комісії з високим відсотком успіху.",
      icon: Scale,
    },
    {
      title: "Незалежна оцінка здоров'я",
      description: "Експертна медична оцінка стану здоров'я для підтвердження професійних захворювань.",
      icon: Shield,
    },
    {
      title: "Швидке вирішення",
      description: "Оперативне ведення справ та максимально швидке досягнення результату за 24 години.",
      icon: Clock,
    },
    {
      title: "Досвідчені юристи",
      description: "Команда спеціалістів з багаторічним досвідом у сфері військового права.",
      icon: Users,
    },
  ]

  const proofItems = [
    { value: "87%", label: "Успішних справ", description: "Виграних оскаржень ВЛК" },
    { value: "500+", label: "Задоволених клієнтів", description: "За 7 років роботи" },
    { value: "24", label: "Години на оскарження", description: "Максимальний термін" },
    { value: "7+", label: "Років досвіду", description: "У військовому праві" },
  ]

  // Команда Правовий Захист
  const legalTeam = [
    {
      name: "Іванов Олексій Петрович",
      position: "Старший партнер",
      image: "/team/legal-1.jpg",
      specialization: "Військове право, оскарження рішень ВЛК"
    },
    {
      name: "Коваленко Марина Сергіївна",
      position: "Адвокат",
      image: "/team/legal-2.jpg",
      specialization: "Адміністративне право, захист прав військовослужбовців"
    },
    {
      name: "Петренко Дмитро Володимирович",
      position: "Юрист-консультант",
      image: "/team/legal-3.jpg",
      specialization: "Консультації з військового законодавства"
    },
    {
      name: "Шевченко Ірина Анатоліївна",
      position: "Провідний юрист",
      image: "/team/legal-4.jpg",
      specialization: "Цивільне право, компенсації військовим"
    },
    {
      name: "Мельник Андрій Ігорович",
      position: "Юрист",
      image: "/team/legal-5.jpg",
      specialization: "Підготовка документів, супровід справ"
    }
  ]

  // Команда Судово-медичні послуги
  const medicalTeam = [
    {
      name: "Білоус Віктор Миколайович",
      position: "Головний експерт",
      image: "/team/medical-1.jpg",
      specialization: "Судово-медична експертиза, 20 років досвіду"
    },
    {
      name: "Кравченко Олена Василівна",
      position: "Лікар-експерт",
      image: "/team/medical-2.jpg",
      specialization: "Незалежна оцінка стану здоров'я"
    },
    {
      name: "Сидоренко Павло Олегович",
      position: "Медичний експерт",
      image: "/team/medical-3.jpg",
      specialization: "Оцінка професійних захворювань"
    },
    {
      name: "Ткаченко Наталія Іванівна",
      position: "Лікар-консультант",
      image: "/team/medical-4.jpg",
      specialization: "Медичне консультування, аналіз документів"
    },
    {
      name: "Морозов Сергій Дмитрович",
      position: "Експерт-аналітик",
      image: "/team/medical-5.jpg",
      specialization: "Комплексна медична експертиза"
    }
  ]

  return (
    <>
      <Hero
        badge="🛡️ Експерти з військового права"
        title="Правовий Захист Дніпро"
        subtitle="Професійна правова допомога військовим"
        description="Оскарження рішень ВЛК, незалежна оцінка здоров'я та повний спектр послуг військового права з 87% успіху."
        primaryAction={{
          text: "📞 Зателефонувати зараз",
          href: "tel:+380633094480"
        }}
        secondaryAction={{
          text: "📝 Записатися на консультацію",
          href: "#consultation"
        }}
      />

      <Features
        title="Чому обирають нас"
        description="Професійний підхід та максимальний результат для кожного клієнта"
        features={features}
        columns={4}
      />

      <Proof
        title="Наші результати"
        description="Цифри, які говорять про нашу ефективність"
        items={proofItems}
        badges={["Ліцензована юридична фірма", "Член Адвокатської палати", "Спеціалізація: військове право"]}
      />

      <Team
        title="Наша команда"
        description="Професіонали, які завжди на вашому боці"
        organization="Правовий Захист Дніпро"
        members={legalTeam}
      />

      <Team
        title=""
        organization="Судово-медичні послуги"
        members={medicalTeam}
      />

      <CTA
        title="Готові захистити ваші права?"
        description="Не чекайте - кожен день має значення у правових питаннях. Отримайте професійну допомогу вже сьогодні."
        primaryAction={{
          text: "📞 Зателефонувати зараз",
          href: "tel:+380633094480"
        }}
        secondaryAction={{
          text: "💬 Написати в месенджер",
          href: "https://t.me/pzdnipro"
        }}
        variant="accent"
      />
    </>
  )
}