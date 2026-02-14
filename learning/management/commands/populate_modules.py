from django.core.management.base import BaseCommand
from learning.models import Module, Lesson, AdinkraSymbol, Quiz, Question, Answer
from django.utils.text import slugify
import random


class Command(BaseCommand):
    help = "Populate additional learning modules from curriculum"

    def handle(self, *args, **kwargs):
        self.stdout.write("Creating Adinkra symbols...")

        # Create Adinkra symbols
        sankofa, _ = AdinkraSymbol.objects.get_or_create(
            name="Sankofa",
            defaults={
                "meaning": "Return and Get It - Learn from the past to build the future",
                "description": "Sankofa teaches us to learn from our past experiences. In digital communication, we build on traditional values while embracing new technologies.",
            },
        )

        duafe, _ = AdinkraSymbol.objects.get_or_create(
            name="Duafe",
            defaults={
                "meaning": "Wooden Comb - Beauty, cleanliness, and care",
                "description": "Just as Duafe represents care and attention to detail, we must carefully manage our digital finances and maintain good financial records.",
            },
        )

        adinkrahene, _ = AdinkraSymbol.objects.get_or_create(
            name="Adinkrahene",
            defaults={
                "meaning": "Chief of Adinkra Symbols - Leadership and excellence",
                "description": "As the chief of all Adinkra symbols, it represents the ability to lead and make wise decisions in using digital resources effectively.",
            },
        )

        nyansapo, _ = AdinkraSymbol.objects.get_or_create(
            name="Nyansapo",
            defaults={
                "meaning": "Wisdom Knot - Wisdom, ingenuity, intelligence",
                "description": "The wisdom knot reminds us to use social media wisely, building positive connections while protecting our privacy and reputation.",
            },
        )

        self.stdout.write(self.style.SUCCESS("✓ Adinkra symbols created"))

        # MODULE 2: Sankofa - Digital Communication
        self.stdout.write("\nCreating Module 2: Sankofa...")
        module2, created = Module.objects.get_or_create(
            slug="sankofa-digital-communication",
            defaults={
                "title": "Sankofa - Digital Communication",
                "description": "Master WhatsApp and digital communication for personal and business use. Learn to communicate effectively online while maintaining cultural values.",
                "adinkra_symbol": sankofa,
                "order": 2,
                "is_published": True,
            },
        )

        if created:
            # Lesson 2.1
            lesson1 = Lesson.objects.create(
                module=module2,
                title="WhatsApp Basics",
                slug="whatsapp-basics",
                content="""# WhatsApp Basics

## Setting Up Your Profile

WhatsApp is Ghana's most popular communication app. Let's learn how to use it effectively.

### Your Profile
- **Profile Photo:** Choose a clear, professional photo
- **About:** Write a brief status message
- **Name:** Use your real name for trust

### Managing Contacts
- Save contacts with full names
- Add international code (+233) for Ghana numbers
- Use labels to organize contacts (Family, Business, Friends)

### Sending Messages
- **Text:** Type and send messages
- **Voice Notes:** Hold the microphone button
- **Emojis:** Express emotions clearly
- **Reply:** Swipe right on a message

### Making Calls
- **Voice Calls:** Free calls over internet
- **Video Calls:** See the person you're talking to
- Need WiFi or data connection

### Status Updates
- Share photos, videos, or text for 24 hours
- Control who can see your status
- View friends' status updates

## Best Practices
- Check your message before sending
- Respect people's time (don't send at night)
- Use clear language
- Listen to voice notes before sending
""",
                order=1,
                duration_minutes=15,
                points_reward=10,
                is_published=True,
            )

            # Lesson 2.2
            lesson2 = Lesson.objects.create(
                module=module2,
                title="WhatsApp for Business",
                slug="whatsapp-for-business",
                content="""# WhatsApp for Business

## Transform Your Business Communication

WhatsApp Business helps Ghanaian entrepreneurs manage customers professionally.

### WhatsApp Business vs Regular WhatsApp
- **Business Profile:** Show your business info
- **Catalog:** Display products with prices
- **Quick Replies:** Save common messages
- **Away Messages:** Auto-reply when unavailable
- **Statistics:** See message performance

### Creating a Business Profile
1. Download WhatsApp Business
2. Add business name
3. Add business category (e.g., Clothing Store)
4. Add description
5. Add opening hours
6. Add location
7. Add website/email

### Business Tools

#### Quick Replies
Save frequently used messages:
- Prices and product info
- Business hours
- Payment instructions
- Delivery details

Example: `/hours` → "We're open Mon-Sat, 9am-6pm"

#### Catalog
- Add product photos
- Include prices in GHS
- Write clear descriptions
- Update regularly

#### Labels
Organize customers:
- 🟢 New Customer
- 🟡 Pending Payment
- 🔴 Order Ready
- 🔵 Regular Customer

### Professional Communication
- Greet customers warmly
- Respond promptly
- Be patient and polite
- Use proper grammar
- Send receipts/confirmations

### Building Trust
- ✓ Use verified business account
- ✓ Reply within 24 hours
- ✓ Clear pricing
- ✓ Honest product descriptions
- ✓ Handle complaints professionally
""",
                order=2,
                duration_minutes=20,
                points_reward=20,
                is_published=True,
            )

            # Lesson 2.3
            lesson3 = Lesson.objects.create(
                module=module2,
                title="Groups and Communities",
                slug="groups-and-communities",
                content="""# WhatsApp Groups and Communities

## Managing Group Communication

### Creating a Group
1. Tap New Chat → New Group
2. Select members (up to 1024)
3. Choose group name
4. Add group icon
5. Write group description

### Group Admin Controls
- Add/remove members
- Change group info
- Delete messages
- Restrict who can send messages
- Restrict who can edit group info

### Group Etiquette

#### Do's ✓
- Introduce yourself when joining
- Stay on topic
- Ask before sharing links
- Respect others' opinions
- Keep messages relevant
- Use appropriate language

#### Don'ts ✗
- Don't spam
- Don't share fake news
- Don't add people without permission
- Don't send late-night messages
- Don't share private info publicly
- Don't forward everything you receive

### Managing Notifications
- Mute groups (8 hours, 1 week, forever)
- Custom notifications for important groups
- Use @ mentions for specific people

### WhatsApp Communities
Perfect for organizations, churches, schools:
- One announcement group
- Multiple discussion groups
- Better organization
- Easier management

### Best Practices
- Clear group purpose
- Good group name
- Set ground rules
- Regular cleanup
- Remove inactive members
- Archive old groups
""",
                order=3,
                duration_minutes=15,
                points_reward=15,
                is_published=True,
            )

            # Lesson 2.4
            lesson4 = Lesson.objects.create(
                module=module2,
                title="Advanced WhatsApp Features",
                slug="advanced-whatsapp-features",
                content="""# Advanced WhatsApp Features

## Master Advanced Tools

### Sharing Location
- **Live Location:** Share your movement for set time
- **Static Location:** Share a specific place
- Useful for: Meeting up, deliveries, emergencies

### Document Sharing
- Send PDFs, Word documents
- Share photos from gallery
- Forward multiple items
- Max file size: 100MB

### Voice and Video Calls
- **Free calls** over WiFi/data
- **Group calls** up to 8 people
- **Screen sharing** for demonstrations
- Works anywhere in the world

### Backup and Restore
Never lose your chats:
1. Settings → Chats → Chat Backup
2. Choose backup frequency (daily/weekly/monthly)
3. Include videos (uses more space)
4. Backs up to Google Drive

### Privacy Settings
Control your privacy:
- Who sees your Last Seen
- Who sees your Profile Photo
- Who sees your About
- Who can add you to groups
- Read receipts (blue ticks)

### Message Tools
- **Star Important Messages:** Easy to find later
- **Disappearing Messages:** Auto-delete after 7 days
- **Archive Chats:** Hide without deleting
- **Search:** Find old messages quickly

### Formatting Text
Make messages stand out:
- *Bold:* Put text between *asterisks*
- _Italic:_ Put text between _underscores_
- ~Strikethrough:~ Put text between ~tildes~
- ```Monospace:``` Put text between ```backticks```

### WhatsApp Web
Use WhatsApp on computer:
1. Go to web.whatsapp.com
2. Scan QR code with phone
3. Type faster on keyboard
4. Better for long messages

Remember: Your phone must be connected to internet!
""",
                order=4,
                duration_minutes=10,
                points_reward=15,
                is_published=True,
            )

            # Create quiz lesson
            quiz_lesson = Lesson.objects.create(
                module=module2,
                title="Module Quiz: Test Your Knowledge",
                slug="module-2-quiz",
                content="Complete this quiz to test your understanding of digital communication and WhatsApp mastery.",
                order=5,
                duration_minutes=10,
                points_reward=50,
                is_published=True,
            )

            # Quiz for Module 2
            quiz2 = Quiz.objects.create(
                lesson=quiz_lesson,
                title="Digital Communication Mastery Quiz",
                description="Test your WhatsApp and digital communication knowledge",
                passing_score=70,
            )

            questions2 = [
                {
                    "text": "What is the main difference between WhatsApp and WhatsApp Business?",
                    "correct": "Business version has professional tools like catalogs and quick replies",
                    "wrong": [
                        "Business version is more expensive",
                        "Business version has more emojis",
                        "Business version is faster",
                    ],
                },
                {
                    "text": "What should you do before adding someone to a WhatsApp group?",
                    "correct": "Ask their permission first",
                    "wrong": [
                        "Add them immediately",
                        "Check their status first",
                        "Send them money",
                    ],
                },
                {
                    "text": "How can you make text bold in WhatsApp?",
                    "correct": "Put text between *asterisks*",
                    "wrong": ["Use capital letters", "Press bold button", "Use emojis"],
                },
                {
                    "text": "What is the maximum number of people in a WhatsApp group?",
                    "correct": "1024 people",
                    "wrong": ["100 people", "500 people", "Unlimited"],
                },
                {
                    "text": "What should you NOT do in a WhatsApp group?",
                    "correct": "Forward every message you receive",
                    "wrong": ["Introduce yourself", "Stay on topic", "Respect others"],
                },
            ]

            for i, q in enumerate(questions2, 1):
                question = Question.objects.create(
                    quiz=quiz2,
                    question_text=q["text"],
                    question_type="multiple_choice",
                    points=10,
                    order=i,
                )
                all_options = [q["correct"]] + q["wrong"]
                random.shuffle(all_options)

                for j, option in enumerate(all_options, 1):
                    Answer.objects.create(
                        question=question,
                        answer_text=option,
                        is_correct=(option == q["correct"]),
                        order=j,
                    )

            self.stdout.write(
                self.style.SUCCESS("✓ Module 2 created with 4 lessons and quiz")
            )

        # MODULE 3: Duafe - Mobile Money
        self.stdout.write("\nCreating Module 3: Duafe...")
        module3, created = Module.objects.get_or_create(
            slug="duafe-mobile-money",
            defaults={
                "title": "Duafe - Mobile Money & Digital Finance",
                "description": "Master mobile money services in Ghana. Learn to send money, pay bills, and manage your digital finances safely.",
                "adinkra_symbol": duafe,
                "order": 3,
                "is_published": True,
            },
        )

        if created:
            # Lesson 3.1
            Lesson.objects.create(
                module=module3,
                title="Mobile Money Fundamentals",
                slug="mobile-money-fundamentals",
                content="""# Mobile Money Fundamentals

## Understanding Mobile Money in Ghana

Mobile money has transformed how Ghanaians handle finances. Let's master it!

### Major Mobile Money Providers
- **MTN Mobile Money (MoMo)** - Most popular
- **AirtelTigo Money** - Growing network
- **Telecel Cash** - Nationwide coverage

### How It Works
Your mobile money account is linked to your phone number:
- **Send money** to any number
- **Receive money** instantly
- **Withdraw cash** at agents
- **Pay bills** directly from phone

### Registering for Mobile Money

#### Requirements
- Valid Ghana Card or Passport
- Active phone number
- Visit authorized agent

#### Steps
1. Go to official agent
2. Provide ID and phone number
3. Create your PIN (keep secret!)
4. Receive confirmation SMS
5. Account activated

### Understanding Fees and Limits

#### MTN Mobile Money (Example)
- Send GHS 1-100: GHS 0.75
- Send GHS 101-500: GHS 2.50
- Send GHS 501-1000: GHS 5.00
- Withdraw: Similar charges

#### Daily Limits
- Transactions: GHS 5,000-10,000
- Withdrawals: GHS 2,000-5,000
- Varies by account type

### Checking Your Balance
- **MTN:** Dial *170#
- **AirtelTigo:** Dial *110#
- **Telecel:** Dial *110#

It's free and instant!

### Account Security
🔐 **Your PIN is like your house key:**
- Never share it
- Don't write it where others can see
- Change it regularly
- Don't use obvious numbers (birthdate, 1234)

### Mobile Money Wallet
Think of it as a digital pocket:
- Money in = Cash in, transfer received
- Money out = Send, withdraw, pay bills
- Always check balance before transactions
""",
                order=1,
                duration_minutes=15,
                points_reward=15,
                is_published=True,
            )

            # Lesson 3.2
            Lesson.objects.create(
                module=module3,
                title="Sending and Receiving Money",
                slug="sending-receiving-money",
                content="""# Sending and Receiving Money

## Master Mobile Money Transactions

### Sending Money

#### Steps (MTN Example)
1. Dial *170#
2. Select "Send Money"
3. Enter recipient's number
4. Enter amount
5. Check details carefully
6. Enter your PIN
7. Confirm
8. Keep confirmation SMS

#### Important Tips
✓ Verify the number before confirming
✓ Check recipient name shown
✓ Confirm amount is correct
✓ Keep transaction reference
✓ Send only to people you know

### Receiving Money
So easy!
- Recipient doesn't need to do anything
- Money arrives automatically
- You get SMS confirmation
- Check your balance to confirm

### Cash In (Depositing Money)
1. Find authorized agent
2. Give them cash
3. Provide your phone number
4. Confirm amount
5. Receive SMS confirmation
6. Agent fee may apply

### Cash Out (Withdrawing Money)
1. Go to agent with ID
2. Dial *170# → Withdraw
3. Enter amount
4. Enter PIN
5. Get transaction code
6. Give code to agent
7. Receive cash
8. Count your money!

### Withdrawal Safety
🔐 Security Tips:
- Use well-lit agents during daytime
- Count money before leaving
- Don't share your code until you're with the agent
- Keep your phone in your hand
- Go with someone if carrying large amounts

### Common Issues and Solutions

#### Transaction Failed?
- Check network connection
- Verify sufficient balance
- Confirm number is correct
- Try again after 10 minutes
- Contact customer service if persists

#### Money Not Received?
- Check your SMS
- Wait 5-10 minutes
- Check with sender
- Call customer care with reference number

### Customer Care Numbers
- **MTN MoMo:** 100 (free)
- **AirtelTigo:** 181 (free)
- **Telecel:** 181 (free)

Available 24/7!
""",
                order=2,
                duration_minutes=15,
                points_reward=15,
                is_published=True,
            )

            # Lesson 3.3
            Lesson.objects.create(
                module=module3,
                title="Digital Payments and Bills",
                slug="digital-payments-bills",
                content="""# Digital Payments and Bills

## Pay Bills from Your Phone

### ECG/Electricity Bills
1. Dial *170#
2. Select "Pay Bill"
3. Choose "ECG"
4. Enter account number
5. Enter amount
6. Confirm
7. Enter PIN
8. Save confirmation SMS

💡 **Pro Tip:** Buy credit before your meter runs out!

### Water Bills (Ghana Water)
- Similar process to ECG
- Enter your water account number
- Pay exact amount or more
- Keep payment receipts

### DStv/GOtv Subscription
1. Dial *170# → Pay Bill
2. Select DStv or GOtv
3. Enter smartcard number
4. Choose package
5. Confirm payment
6. Decoder activates immediately

### Buying Airtime and Data
Super quick and easy!

#### For Yourself
- Dial *170# → Airtime/Data
- Select amount or bundle
- Confirm with PIN
- Credit loads immediately

#### For Others
- Same process
- Enter their number
- Great for family support!

### Merchant Payments
Many businesses now accept mobile money:
- Shops and stores
- Restaurants
- Online shopping
- Transportation

#### How to Pay
1. Ask for merchant number or code
2. Send exact amount
3. Show confirmation to merchant
4. Always get receipt

### Online Shopping with Mobile Money
1. Select items
2. Choose "Mobile Money" at checkout
3. Enter your number
4. Approve payment on phone
5. Wait for delivery

### Payment Safety Tips
🛡️ **Protect Yourself:**
- Only pay known merchants
- Verify business details
- Keep all receipts
- Check confirmations
- Report suspicious requests

### Keeping Records
📝 **Good Practices:**
- Screenshot confirmations
- Save transaction SMS
- Note what payment was for
- Organize by month
- Review regularly

### Resolving Payment Issues
If payment doesn't work:
1. Check confirmation SMS
2. Contact merchant with reference
3. Wait 24 hours for processing
4. Call mobile money customer care
5. Visit service center if unresolved
""",
                order=3,
                duration_minutes=10,
                points_reward=10,
                is_published=True,
            )

            # Lesson 3.4
            Lesson.objects.create(
                module=module3,
                title="Financial Safety and Budgeting",
                slug="financial-safety-budgeting",
                content="""# Financial Safety and Budgeting

## Protect Your Money and Plan Well

### Common Mobile Money Scams

#### 1. Fake Customer Care Calls
**Scam:** "We're from MTN, send money to verify your account"
**Truth:** Real customer care NEVER asks for money or PIN

#### 2. Wrong Transfer Scams
**Scam:** "I sent you money by mistake, please return it"
**Truth:** Check if you actually received money first!

#### 3. Prize/Lottery Scams
**Scam:** "You won GHS 50,000! Send GHS 500 to claim"
**Truth:** Real lotteries don't ask for money to claim prizes

#### 4. Love Scams
**Scam:** Online "lover" needs emergency money
**Truth:** Never send money to someone you haven't met

#### 5. Job Scams
**Scam:** "Pay registration fee to get job"
**Truth:** Real employers don't charge job applicants

### How to Avoid Fraud
🛡️ **Golden Rules:**
- Never share your PIN with anyone
- Never send money to strangers
- Verify requests by calling official numbers
- If it sounds too good to be true, it is
- Don't act under pressure

### What to Do If Scammed
1. Call customer care immediately: 100
2. Report to police (Cyber Crime Unit)
3. Change your PIN
4. Block suspicious numbers
5. Learn and move forward

### Keeping Transaction Records

#### SMS Management
- Save important transaction SMS
- Create folder: "MoMo Transactions"
- Delete spam, keep records
- Back up important ones

#### Manual Record Keeping
Keep a small notebook:
```
Date | Type | Amount | Who/What | Balance
-----|------|--------|----------|--------
14/2 | Sent | 50 | Sister  | 200
14/2 | Bills| 30 | ECG     | 170
```

### Monthly Budget with Mobile Money

#### Step 1: Track Spending
Check your mobile money statement:
- Dial *170# → My Account → Mini Statement
- Note what you spent on

#### Step 2: Plan Your Money
Example Monthly Budget (GHS 1000):
- **Needs** (50%): GHS 500
  - Food, rent, bills
- **Savings** (20%): GHS 200
  - Keep in mobile money savings
- **Wants** (20%): GHS 200
  - Entertainment, treats
- **Emergency** (10%): GHS 100
  - Don't touch unless emergency

#### Step 3: Use Mobile Money Features
- **Mobile Money Savings:** Earn interest!
- **Goal-based savings:** Save for specific things
- **Transaction limits:** Prevent overspending
- **Regular bill payments:** Never miss payments

### Building Financial Discipline
✓ Check balance before buying wants
✓ Wait 24 hours before large purchases
✓ Save first, spend later
✓ Track every transaction
✓ Review spending weekly

### Growing Your Money
- **Mobile Money Savings:** Better than mattress banking!
- **Interest earnings:** Free money on your savings
- **Reduce cash handling:** Safer and more convenient
- **Access to more services:** Loans, insurance coming soon

### Teaching Financial Literacy
Share these skills:
- Show family how to budget
- Teach friends mobile money safety
- Protect elderly from scams
- Build a financially literate community

Remember: **Your mobile money is real money. Treat it with respect and care!**
""",
                order=4,
                duration_minutes=10,
                points_reward=20,
                is_published=True,
            )

            # Quiz 3
            quiz3 = Quiz.objects.create(
                module=module3,
                title="Mobile Money Mastery Quiz",
                description="Test your digital finance knowledge",
                passing_score=70,
                time_limit_minutes=10,
                is_published=True,
            )

            questions3 = [
                {
                    "text": "What should you NEVER share with anyone?",
                    "correct": "Your mobile money PIN",
                    "wrong": [
                        "Your phone number",
                        "Your mobile money balance",
                        "Transaction confirmations",
                    ],
                },
                {
                    "text": "What is the first thing to do if you think you've been scammed?",
                    "correct": "Call customer care immediately (100)",
                    "wrong": [
                        "Send more money",
                        "Delete all messages",
                        "Buy a new phone",
                    ],
                },
                {
                    "text": "How can you check your mobile money balance on MTN?",
                    "correct": "Dial *170#",
                    "wrong": [
                        "Send SMS to 100",
                        "Call customer care",
                        "Go to the bank",
                    ],
                },
                {
                    "text": "What percentage of monthly income should go to savings?",
                    "correct": "20%",
                    "wrong": ["5%", "50%", "90%"],
                },
                {
                    "text": "If someone calls claiming to be from MTN customer care asking for money, what should you do?",
                    "correct": "Hang up - real customer care never asks for money",
                    "wrong": [
                        "Send money immediately",
                        "Share your PIN",
                        "Follow their instructions",
                    ],
                },
            ]

            for i, q in enumerate(questions3, 1):
                question = QuizQuestion.objects.create(
                    quiz=quiz3,
                    question_text=q["text"],
                    question_type="multiple_choice",
                    points=10,
                    order=i,
                )
                all_options = [q["correct"]] + q["wrong"]
                import random

                random.shuffle(all_options)
                question.options = all_options
                question.correct_answer = q["correct"]
                question.save()

            self.stdout.write(
                self.style.SUCCESS("✓ Module 3 created with 4 lessons and quiz")
            )

        # MODULE 4: Adinkrahene - Information Literacy
        self.stdout.write("\nCreating Module 4: Adinkrahene...")
        module4, created = Module.objects.get_or_create(
            slug="adinkrahene-information-literacy",
            defaults={
                "title": "Adinkrahene - Information Literacy",
                "description": "Navigate the internet effectively, find reliable information, and access online resources including government services.",
                "adinkra_symbol": adinkrahene,
                "order": 4,
                "is_published": True,
            },
        )

        if created:
            # Lesson 4.1
            Lesson.objects.create(
                module=module4,
                title="Internet Basics and Search",
                slug="internet-basics-search",
                content="""# Internet Basics and Search

## Navigate the Digital World

### Understanding the Internet
The internet is like a huge library that connects the whole world:
- **Websites** - Like books
- **Web browsers** - Your reading tool
- **Search engines** - The library catalog
- **Links** - Connections between pages

### Web Browsers
Choose your reading tool:
- **Google Chrome** - Most popular
- **Safari** - For iPhone users
- **Firefox** - Privacy-focused
- **Edge** - Microsoft's browser

All work similarly!

### Using a Web Browser

#### Address Bar (Top)
- Type website addresses
- Also works as search
- Shows secure connection (🔒)

#### Navigation Buttons
- ← Back: Return to previous page
- → Forward: Go to next page
- ⟳ Refresh: Reload current page
- 🏠 Home: Go to start page

### Search Engines Effectively

#### Google Search Tips
**Basic Search:**
- Just type what you're looking for
- Be specific: "ECG office Accra contact" not just "ECG"

**Advanced Tricks:**
- **Exact phrase:** Use quotes "Ghana Card registration"
- **Multiple words:** "passport OR Ghana Card"
- **Exclude words:** "phones -iPhone" (no iPhone results)
- **Specific site:** "renewable energy site:gov.gh"

#### Finding Ghanaian Information
Add "Ghana" to searches:
- "mobile money Ghana"
- "weather Accra Ghana"
- "news Ghana today"

### Useful Ghanaian Websites

#### Government
- **Ghana.gov.gh** - Official portal
- **Nia.gov.gh** - Ghana Card
- **GRA.gov.gh** - Tax information
- **ECG.com.gh** - Electricity

#### News
- **Graphic.com.gh** - Daily Graphic
- **Myjoyonline.com** - Multimedia Group
- **Ghanaweb.com** - News aggregator

#### Education
- **Ghanaadultschool.com** - Adult learning
- **Coursera.org** - Free courses
- **Khan Academy** - Free education

### Bookmarking Important Sites
Save frequently visited pages:
1. Visit the website
2. Click star icon ⭐ (or press Ctrl+D)
3. Name your bookmark
4. Choose folder
5. Save

Organize bookmarks in folders:
- 📁 Government Services
- 📁 News
- 📁 Education
- 📁 Shopping

### Browser Safety
🔒 **Stay Safe:**
- Look for padlock 🔒 before entering passwords
- Check website address carefully
- Don't click suspicious links
- Update your browser regularly
- Use private/incognito mode for sensitive searches

### Internet Data Management
Save data (and money!):
- Use WiFi when available
- Don't autoplay videos
- Close unused tabs
- Block ads (use ad blocker)
- Download offline content

### Troubleshooting Common Issues

**Page won't load?**
- Check internet connection
- Try refreshing
- Clear browser cache
- Try different browser

**Website looks strange?**
- Could be fake/phishing site
- Check URL carefully
- Don't enter personal info
- Close immediately if suspicious
""",
                order=1,
                duration_minutes=15,
                points_reward=15,
                is_published=True,
            )

            # Lesson 4.2
            Lesson.objects.create(
                module=module4,
                title="Identifying Reliable Information",
                slug="identifying-reliable-information",
                content="""# Identifying Reliable Information

## Separate Fact from Fiction

### The Problem: Misinformation in Ghana
Every day, false information spreads:
- Fake health cures
- False political claims
- Edited photos/videos
- Pyramid schemes
- Fake emergency news

**Your skill in verifying information protects you and your community!**

### What is Fake News?
Information that is:
- Deliberately false
- Misleading headlines
- Out of context
- Unverified rumors
- Manipulated media

### The CRAAP Test for Information

#### **C - Currency** (Timeliness)
✓ When was it published?
✓ Is it still relevant?
✓ Are links/info updated?
❌ Old news shared as new

#### **R - Relevance** (Importance)
✓ Does it answer your question?
✓ Is it for your level?
✓ Would you cite it?
❌ Off-topic or too advanced

#### **A - Authority** (Source)
✓ Who wrote it?
✓ Are they qualified?
✓ Can you contact them?
❌ Anonymous or fishy sources

#### **A - Accuracy** (Correctness)
✓ Can you verify facts elsewhere?
✓ Are sources cited?
✓ Is grammar/spelling good?
❌ Lots of errors or no sources

#### **P - Purpose** (Reason)
✓ Why was it written?
✓ Is it biased?
✓ Is it trying to sell something?
❌ Manipulative or propaganda

### Reliable Ghanaian Sources

#### Government
✓ Websites ending in **.gov.gh**
✓ Official social media (verified ✓)
✓ Press releases
✓ Official documents

#### Established Media
✓ Daily Graphic
✓ Joy FM/TV
✓ Citi FM/TV
✓ Ghana Broadcasting Corporation

#### Academic/Research
✓ Universities (.edu.gh)
✓ Research institutions
✓ Academic journals
✓ Expert interviews

### Warning Signs of Fake News

🚩 **Red Flags:**
- ALL CAPS HEADLINES!!!
- Lots of exclamation marks!!!
- Too good to be true
- Asks you to "share immediately"
- No author name
- No date
- Blurry images
- Emotional language
- Spelling mistakes
- Ends with "forward to 10 people"

### Fact-Checking Steps

#### Step 1: Check the Source
- Who published it?
- Is it a real organization?
- Search for their website

#### Step 2: Check the Date
- When was it published?
- Is it current or old news?

#### Step 3: Check Multiple Sources
- Do at least 2-3 other sites confirm?
- What do mainstream media say?

#### Step 4: Check Images
- Do a reverse image search (Google Images)
- Are images edited or from different event?

#### Step 5: Check Your Bias
- Do you believe it because you want to?
- Would you check if it opposed your view?

### Fact-Checking Websites
- **AFP Fact Check** - Covers Africa
- **Africa Check** - Verifies African claims
- **DuBawa** - Ghanaian fact-checking
- **Snopes** - International fact-checking

### Common Myths in Ghana

❌ **"Put phone in rice if wet"**
✓ **Truth:** Rice doesn't help. Turn off and get professionally dried.

❌ **"Charging phone overnight damages battery"**
✓ **Truth:** Modern phones stop charging when full.

❌ **"5G causes COVID"**
✓ **Truth:** Completely false. 5G is radio waves.

❌ **"Mix of Coke and paracetamol gets you high"**
✓ **Truth:** Dangerous myth. Don't try.

### Your Responsibility
Before sharing ANY information:
1. ✓ Verify it's true
2. ✓ Check the source
3. ✓ Consider the impact
4. ✓ Don't spread fear
5. ✓ Be part of the solution

**Remember: Sharing fake news makes YOU part of the problem. Be a responsible digital citizen!**
""",
                order=2,
                duration_minutes=15,
                points_reward=20,
                is_published=True,
            )

            # Lesson 4.3
            Lesson.objects.create(
                module=module4,
                title="Digital Government Services",
                slug="digital-government-services",
                content="""# Digital Government Services

## Access Government Services Online

### Ghana.gov.gh Portal
Your gateway to government services!

**What You Can Do:**
- Apply for Ghana Card
- Apply for passport
- Pay taxes
- Check vehicle info
- Register business
- Access forms
- Contact ministries

### Ghana Card Services

#### Check Application Status
1. Visit **nia.gov.gh**
2. Click "Check Status"
3. Enter application number
4. View status

#### Book Ghana Card Appointment
1. Go to **nia.gov.gh**
2. Select "Book Appointment"
3. Choose location
4. Pick date/time
5. Confirm booking

#### Ghana Card Uses
Your main ID for:
- Opening bank accounts
- SIM registration
- Voting
- Government services
- Age verification

### Passport Services

#### Apply for Passport Online
1. Visit **passport.gov.gh**
2. Create account
3. Fill form online
4. Upload photo
5. Pay online
6. Book appointment
7. Visit passport office
8. Collect passport later

#### Requirements
- Ghana Card
- Birth certificate
- Passport photos
- Fee: GHS 100-350 (depending on type)

#### Track Passport Status
- Use application number
- Check online anytime
- Get SMS updates

### GRA eTax Portal

#### Register for TIN
1. Visit **elogin.gra.gov.gh**
2. Register account
3. Submit info
4. Get TIN certificate

#### File Taxes Online
- Self-assessment
- VAT returns
- PAYE for employers
- Check tax status

### Driver's License Services

#### DVLA Online
- Book driving test
- Check license status
- Register vehicle
- Pay road worthy fees

### Business Registration

#### RGD - Registrar General's Department
**Register business online:**
1. Visit **rgd.gov.gh**
2. Search available names
3. Submit application
4. Pay registration fee
5. Download certificate

### ECG Services

#### Online ECG Portal
- Buy prepaid credit
- Check postpaid balance
- Report faults
- View consumption history
- Update account info

### Ghana Water Online
- View bills
- Make payments
- Report issues
- Check tariffs

### NHIS Services

#### Check NHIS Status
- Renewal online
- Check expiry date
- Find accredited facilities

### Benefits of Digital Government Services

✓ **Save Time** - No long queues
✓ **Save Money** - No transport costs
✓ **Convenience** - 24/7 access
✓ **Transparency** - Track your application
✓ **Records** - Keep digital copies
✓ **Efficiency** - Faster processing

### Tips for Using Gov Services

1. **Keep Records**
   - Screenshot confirmations
   - Save reference numbers
   - Download receipts

2. **Use Official Sites**
   - Look for **.gov.gh**
   - Bookmark official sites
   - Don't use suspicious links

3. **Payment Safety**
   - Use secure connections (🔒)
   - Check URL before paying
   - Keep payment confirmations

4. **Follow Up**
   - Note application deadlines
   - Check status regularly
   - Contact support if delayed

### Getting Help
Each service has support:
- Phone numbers on websites
- Email support
- Social media pages
- Walk-in centers for assistance

### Future of eGovernment
Coming soon:
- More services online
- Mobile apps
- Digital signatures
- AI assistants
- Faster processing

**Ghana is going digital. Stay ahead by using these services!**
""",
                order=3,
                duration_minutes=15,
                points_reward=15,
                is_published=True,
            )

            # Lesson 4.4
            Lesson.objects.create(
                module=module4,
                title="Online Learning Resources",
                slug="online-learning-resources",
                content="""# Online Learning and Development

## Never Stop Learning!

### Free Online Learning Platforms

#### YouTube - The Free University
**Topics Available:**
- Digital skills
- Business management
- Language learning
- Farming techniques
- Cooking
- Repair and maintenance
- And everything else!

**How to Learn Effectively:**
1. Subscribe to educational channels
2. Create playlists by topic
3. Take notes while watching
4. Practice what you learn
5. Watch at your own pace

**Recommended Channels:**
- GCFLearnFree - Computer skills
- Khan Academy - All subjects
- Ted-Ed - Short lessons
- Practical skills channels

#### Coursera
**Website:** coursera.org
- Free courses from top universities
- Topics: Business, IT, health, more
- Certificates available (some paid)
- Learn at your own pace
- Mobile app available

#### Khan Academy
**Website:** khanacademy.org
- Completely free
- Math, science, economics
- For all ages
- Track your progress
- Practice exercises

#### edX
**Website:** edx.org
- University-level courses
- Free to learn
- Certificate optional (paid)
- Wide range of topics

### Skills for the Digital Economy

#### In-Demand Digital Skills
1. **Social Media Management**
   - Growing businesses need this
   - Learn to create content
   - Manage Facebook/Instagram pages

2. **Basic Graphic Design**
   - Canva.com - Free tool
   - Create posters, flyers
   - Design social media posts

3. **Online Selling**
   - E-commerce skills
   - Product photography
   - Customer service

4. **Data Entry**
   - Typing skills
   - Spreadsheet basics
   - Attention to detail

5. **Digital Marketing**
   - Facebook/Google ads
   - Content creation
   - Analytics basics

### Learning Apps

#### Recommended Apps
- **Duolingo** - Learn languages free
- **SoloLearn** - Coding for beginners
- **LinkedIn Learning** - Professional skills
- **Udemy** - Affordable courses
- **Skillshare** - Creative skills

### YouTube for Skills

#### Practical Skills You Can Learn
- Phone/computer repair
- Tailoring and fashion
- Hairdressing techniques
- Cooking and catering
- Photography
- Video editing
- Farming methods
- Business management

#### Tips for Learning from YouTube
✓ Find channels in English
✓ Watch with good internet (download offline)
✓ Take notes
✓ Practice immediately
✓ Join community discussions
✓ Ask questions in comments

### Creating Your Learning Plan

#### Step 1: Identify Your Goal
What do you want to learn?
- New job skill?
- Improve current work?
- Start a business?
- Personal interest?

#### Step 2: Find Resources
- Search for courses
- Check reviews
- Compare options
- Start with free resources

#### Step 3: Schedule Learning Time
- 30 minutes daily OR
- 2 hours on weekends
- Consistency matters!
- Make it a habit

#### Step 4: Practice
- Apply what you learn
- Start small projects
- Share your work
- Get feedback

#### Step 5: Track Progress
- Complete one course at a time
- Take notes
- Review regularly
- Celebrate milestones!

### Building a Digital Portfolio
Show your skills:
- Create samples of your work
- Take before/after photos
- Write case studies
- Share on social media
- Get testimonials

### Joining Online Communities

#### WhatsApp Groups
- Find groups for your interest
- Share knowledge
- Ask questions
- Network with others

#### Facebook Groups
- "Ghana Entrepreneurs"
- "Digital Marketing Ghana"
- "Learn to Code Ghana"
- Many more!

### Earning While Learning

#### Freelancing Opportunities
Once you've learned skills:
- **Upwork** - Global freelancing
- **Fiverr** - Sell services
- **Local gigs** - Support Ghanaian businesses
- **Social media management** - For local shops

### Free Certificates
Many platforms offer free certificates:
- Google Digital Garage
- HubSpot Academy
- Facebook Blueprint
- LinkedIn Learning (some)

Add to your CV/resume!

### Your Learning Journey
**Remember:**
- Start small
- Be consistent
- Don't give up
- Apply knowledge
- Share what you learn
- Help others

**The internet is the world's largest classroom. Your education never has to stop!**

### Next Steps
1. Choose one skill to learn this month
2. Find a free course
3. Schedule 30 min daily
4. Complete one lesson today
5. Share what you learned!

**Your future starts with what you learn today! 🚀**
""",
                order=4,
                duration_minutes=10,
                points_reward=15,
                is_published=True,
            )

            # Quiz 4
            quiz4 = Quiz.objects.create(
                module=module4,
                title="Information Literacy Quiz",
                description="Test your ability to find and verify information online",
                passing_score=70,
                time_limit_minutes=10,
                is_published=True,
            )

            questions4 = [
                {
                    "text": "What is a major warning sign that information might be fake news?",
                    "correct": "ALL CAPS with many exclamation marks!!!",
                    "wrong": [
                        "Published by known newspaper",
                        "Includes author name",
                        "Has a clear date",
                    ],
                },
                {
                    "text": "Which website domain indicates an official government site in Ghana?",
                    "correct": ".gov.gh",
                    "wrong": [".com.gh", ".org.gh", ".gov.com"],
                },
                {
                    "text": "Before sharing information on WhatsApp, what should you do?",
                    "correct": "Verify it is true from multiple reliable sources",
                    "wrong": [
                        "Share it immediately",
                        "Add your own opinion",
                        "Forward to all contacts",
                    ],
                },
                {
                    "text": "Which is a completely FREE platform for online learning?",
                    "correct": "Khan Academy",
                    "wrong": [
                        "Netflix University",
                        "Premium Learning Hub",
                        "Expensive Courses Online",
                    ],
                },
                {
                    "text": "What can you do on the Ghana.gov.gh portal?",
                    "correct": "Apply for passport and access government services",
                    "wrong": ["Watch movies", "Play games", "Shop for clothes"],
                },
            ]

            for i, q in enumerate(questions4, 1):
                question = QuizQuestion.objects.create(
                    quiz=quiz4,
                    question_text=q["text"],
                    question_type="multiple_choice",
                    points=10,
                    order=i,
                )
                all_options = [q["correct"]] + q["wrong"]
                import random

                random.shuffle(all_options)
                question.options = all_options
                question.correct_answer = q["correct"]
                question.save()

            self.stdout.write(
                self.style.SUCCESS("✓ Module 4 created with 4 lessons and quiz")
            )

        self.stdout.write(
            self.style.SUCCESS("\n✅ All modules populated successfully!")
        )
        self.stdout.write(self.style.SUCCESS("📚 Total modules: 4"))
        self.stdout.write(self.style.SUCCESS("📖 Total lessons: 16"))
        self.stdout.write(self.style.SUCCESS("❓ Total quizzes: 4"))
