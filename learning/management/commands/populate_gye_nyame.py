from django.core.management.base import BaseCommand
from learning.models import (
    AdinkraSymbol,
    Module,
    Lesson,
    ContentBlock,
    Quiz,
    Question,
    Answer,
)


class Command(BaseCommand):
    help = "Populate the database with the Gye Nyame module content"

    def handle(self, *args, **options):
        self.stdout.write("Creating Gye Nyame module...")

        # Create Adinkra Symbol
        gye_nyame_symbol, created = AdinkraSymbol.objects.get_or_create(
            name="Gye Nyame",
            defaults={
                "meaning": "Except God",
                "cultural_significance": "Gye Nyame symbolizes the supremacy and immortality of God. "
                "It expresses deep faith in God's protection and omnipotence. "
                "Just as we trust in God's protection, we must also protect our "
                "digital identity and personal information.",
                "pronunciation": "Jeh Nyah-meh",
            },
        )

        # Create Module
        module, created = Module.objects.get_or_create(
            slug="gye-nyame-cybersecurity",
            defaults={
                "title": "Gye Nyame: Digital Safety & Privacy",
                "description": "Learn how to protect yourself online through the wisdom of Gye Nyame. "
                "Just as this symbol represents God's supreme protection, you will learn "
                "to protect your digital life through cybersecurity and data privacy practices.",
                "adinkra_symbol": gye_nyame_symbol,
                "digital_literacy_topic": "Cybersecurity & Data Privacy",
                "order": 1,
                "estimated_duration_minutes": 45,
                "difficulty_level": "beginner",
                "is_published": True,
            },
        )

        # Lesson 1: Introduction to Digital Safety
        lesson1, _ = Lesson.objects.get_or_create(
            module=module,
            slug="introduction-to-digital-safety",
            defaults={
                "title": "Introduction to Digital Safety",
                "order": 1,
                "content_type": "text",
                "content": "Welcome to the world of digital safety! In this lesson, you will learn "
                "why protecting your digital information is as important as protecting your "
                "physical possessions.",
                "estimated_duration_minutes": 10,
                "is_published": True,
            },
        )

        # Content blocks for Lesson 1
        ContentBlock.objects.get_or_create(
            lesson=lesson1,
            order=1,
            defaults={"block_type": "heading", "content": "Why Digital Safety Matters"},
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson1,
            order=2,
            defaults={
                "block_type": "text",
                "content": "In today's Ghana, we use mobile phones for everything: banking, communication, "
                "business, and learning. But just like we lock our doors at night, we must also "
                "protect our digital lives.",
            },
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson1,
            order=3,
            defaults={
                "block_type": "example",
                "content": "Think of your phone as your wallet. You wouldn't leave your wallet open "
                "on a busy street in Accra, would you? The same applies to your digital information!",
            },
        )

        # Lesson 2: Creating Strong Passwords
        lesson2, _ = Lesson.objects.get_or_create(
            module=module,
            slug="creating-strong-passwords",
            defaults={
                "title": "Creating Strong Passwords",
                "order": 2,
                "content_type": "interactive",
                "content": "Passwords are the keys to your digital life. Learn how to create passwords "
                "that protect you.",
                "estimated_duration_minutes": 15,
                "is_published": True,
            },
        )

        # Content blocks for Lesson 2
        ContentBlock.objects.get_or_create(
            lesson=lesson2,
            order=1,
            defaults={
                "block_type": "heading",
                "content": "What Makes a Strong Password?",
            },
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson2,
            order=2,
            defaults={
                "block_type": "text",
                "content": "A strong password is like a strong fence around your compound. "
                "It should be: At least 8 characters long, Include uppercase and lowercase letters, "
                "Contain numbers and symbols, Not be easy to guess (avoid names, birthdays)",
            },
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson2,
            order=3,
            defaults={
                "block_type": "tip",
                "content": "💡 TIP: Create a password using the first letters of a sentence you remember. "
                'Example: "I was born in Accra in 1995!" becomes "IwbiAi1995!"',
            },
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson2,
            order=4,
            defaults={
                "block_type": "warning",
                "content": "⚠️ NEVER share your password with anyone, even family or friends!",
            },
        )

        # Lesson 3: Protecting Your WhatsApp
        lesson3, _ = Lesson.objects.get_or_create(
            module=module,
            slug="protecting-your-whatsapp",
            defaults={
                "title": "Protecting Your WhatsApp",
                "order": 3,
                "content_type": "text",
                "content": "WhatsApp is widely used in Ghana for communication and business. "
                "Learn how to use it safely.",
                "estimated_duration_minutes": 10,
                "is_published": True,
            },
        )

        # Content blocks for Lesson 3
        ContentBlock.objects.get_or_create(
            lesson=lesson3,
            order=1,
            defaults={"block_type": "heading", "content": "WhatsApp Security Features"},
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson3,
            order=2,
            defaults={
                "block_type": "text",
                "content": "1. Enable Two-Step Verification: Settings > Account > Two-step verification\n"
                "2. Use Fingerprint/Face Lock: Settings > Privacy > Fingerprint lock\n"
                "3. Control who can see your info: Settings > Privacy",
            },
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson3,
            order=3,
            defaults={
                "block_type": "warning",
                "content": "⚠️ Beware of scam messages! If someone sends you a message asking for money "
                "or personal information, verify by calling them directly.",
            },
        )

        # Lesson 4: Mobile Money Safety
        lesson4, _ = Lesson.objects.get_or_create(
            module=module,
            slug="mobile-money-safety",
            defaults={
                "title": "Mobile Money Safety",
                "order": 4,
                "content_type": "text",
                "content": "Mobile money has transformed Ghana. Learn to use it safely.",
                "estimated_duration_minutes": 10,
                "is_published": True,
            },
        )

        # Content blocks for Lesson 4
        ContentBlock.objects.get_or_create(
            lesson=lesson4,
            order=1,
            defaults={"block_type": "heading", "content": "Mobile Money Safety Rules"},
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson4,
            order=2,
            defaults={
                "block_type": "text",
                "content": "1. Keep your PIN secret - never write it down\n"
                "2. Only send money to people you know\n"
                "3. Double-check phone numbers before sending\n"
                "4. Beware of calls asking for your PIN\n"
                "5. Check your balance regularly",
            },
        )

        ContentBlock.objects.get_or_create(
            lesson=lesson4,
            order=3,
            defaults={
                "block_type": "example",
                "content": "Common Scam: Someone calls pretending to be from MTN/AirtelTigo and asks for "
                'your PIN to "fix a problem." MTN will NEVER ask for your PIN. Hang up immediately!',
            },
        )

        # Create Quiz for the module
        quiz, _ = Quiz.objects.get_or_create(
            lesson=lesson4,
            defaults={
                "title": "Gye Nyame Module Quiz",
                "description": "Test your knowledge of digital safety and privacy",
                "passing_score": 70,
            },
        )

        # Quiz Questions
        q1, _ = Question.objects.get_or_create(
            quiz=quiz,
            order=1,
            defaults={
                "question_text": "What makes a password strong?",
                "question_type": "multiple_choice",
                "points": 10,
                "explanation": "A strong password includes a mix of uppercase, lowercase, numbers, and symbols, "
                "and is at least 8 characters long.",
            },
        )

        Answer.objects.get_or_create(
            question=q1,
            order=1,
            defaults={"answer_text": "Your birthday", "is_correct": False},
        )
        Answer.objects.get_or_create(
            question=q1,
            order=2,
            defaults={"answer_text": "Your name", "is_correct": False},
        )
        Answer.objects.get_or_create(
            question=q1,
            order=3,
            defaults={
                "answer_text": "A mix of letters, numbers, and symbols",
                "is_correct": True,
            },
        )
        Answer.objects.get_or_create(
            question=q1,
            order=4,
            defaults={"answer_text": "12345678", "is_correct": False},
        )

        q2, _ = Question.objects.get_or_create(
            quiz=quiz,
            order=2,
            defaults={
                "question_text": "Should you share your mobile money PIN with family members?",
                "question_type": "true_false",
                "points": 10,
                "explanation": "Never share your PIN with anyone, even family. It is your personal security code.",
            },
        )

        Answer.objects.get_or_create(
            question=q2, order=1, defaults={"answer_text": "True", "is_correct": False}
        )
        Answer.objects.get_or_create(
            question=q2, order=2, defaults={"answer_text": "False", "is_correct": True}
        )

        q3, _ = Question.objects.get_or_create(
            quiz=quiz,
            order=3,
            defaults={
                "question_text": "What should you do if someone calls claiming to be from MTN and asks for your PIN?",
                "question_type": "multiple_choice",
                "points": 10,
                "explanation": "Legitimate companies will never ask for your PIN over the phone. Hang up immediately.",
            },
        )

        Answer.objects.get_or_create(
            question=q3,
            order=1,
            defaults={"answer_text": "Give them your PIN", "is_correct": False},
        )
        Answer.objects.get_or_create(
            question=q3,
            order=2,
            defaults={"answer_text": "Hang up immediately", "is_correct": True},
        )
        Answer.objects.get_or_create(
            question=q3,
            order=3,
            defaults={
                "answer_text": "Ask them to wait while you check",
                "is_correct": False,
            },
        )

        q4, _ = Question.objects.get_or_create(
            quiz=quiz,
            order=4,
            defaults={
                "question_text": "What WhatsApp security feature should you enable?",
                "question_type": "multiple_choice",
                "points": 10,
                "explanation": "Two-step verification adds an extra layer of security to your WhatsApp account.",
            },
        )

        Answer.objects.get_or_create(
            question=q4,
            order=1,
            defaults={"answer_text": "Two-step verification", "is_correct": True},
        )
        Answer.objects.get_or_create(
            question=q4,
            order=2,
            defaults={"answer_text": "Auto-delete messages", "is_correct": False},
        )
        Answer.objects.get_or_create(
            question=q4,
            order=3,
            defaults={"answer_text": "Share all contacts", "is_correct": False},
        )

        q5, _ = Question.objects.get_or_create(
            quiz=quiz,
            order=5,
            defaults={
                "question_text": "Why is the Gye Nyame symbol connected to digital safety?",
                "question_type": "multiple_choice",
                "points": 10,
                "explanation": "Gye Nyame represents God's supreme protection. Similarly, we must protect "
                "our digital identity and information.",
            },
        )

        Answer.objects.get_or_create(
            question=q5,
            order=1,
            defaults={"answer_text": "It looks like a phone", "is_correct": False},
        )
        Answer.objects.get_or_create(
            question=q5,
            order=2,
            defaults={
                "answer_text": "It represents protection, just as we protect our digital lives",
                "is_correct": True,
            },
        )
        Answer.objects.get_or_create(
            question=q5,
            order=3,
            defaults={
                "answer_text": "It was created for computers",
                "is_correct": False,
            },
        )

        self.stdout.write(
            self.style.SUCCESS("Successfully populated Gye Nyame module!")
        )
        self.stdout.write(f"Module: {module.title}")
        self.stdout.write(f"Lessons: {module.lessons.count()}")
        self.stdout.write(f"Quiz Questions: {quiz.questions.count()}")
