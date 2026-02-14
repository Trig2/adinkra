from django.core.management.base import BaseCommand
from learning.models import AdinkraSymbol


class Command(BaseCommand):
    help = "Assign the existing image to Gye Nyame symbol"

    def handle(self, *args, **options):
        try:
            gye_nyame = AdinkraSymbol.objects.get(name="Gye Nyame")
            
            # Assign the image
            gye_nyame.image = "adinkra_symbols/Screenshot_2025-12-14_111656.png"
            gye_nyame.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully assigned image to {gye_nyame.name}"
                )
            )
            self.stdout.write(f"Image path: {gye_nyame.image}")
            
        except AdinkraSymbol.DoesNotExist:
            self.stdout.write(
                self.style.ERROR("Gye Nyame symbol not found in database")
            )
