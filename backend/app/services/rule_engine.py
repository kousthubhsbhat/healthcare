import re
from typing import List, Dict, Any, Tuple
from app.models.schemas import BiomarkerValue, Allergy

class ClinicalRuleEngine:
    """
    Deterministic Python Rule Engine for medical safety verification,
    abnormal lab value flagging, and drug-allergy contraindication checks.
    """

    @staticmethod
    def evaluate_biomarkers(biomarkers: List[BiomarkerValue]) -> Tuple[List[BiomarkerValue], List[str]]:
        """
        Evaluates extracted lab biomarkers against clinical thresholds.
        Returns the updated biomarkers with flags and a list of high-priority clinical alerts.
        """
        alerts: List[str] = []
        evaluated_biomarkers: List[BiomarkerValue] = []

        for bm in biomarkers:
            name_lower = bm.name.lower()
            val_clean = re.sub(r'[^0-9.]', '', bm.value)
            
            try:
                numeric_val = float(val_clean) if val_clean else None
            except ValueError:
                numeric_val = None

            is_abnormal = False
            clinical_alert = None

            if numeric_val is not None:
                # 1. Blood Glucose Rules
                if 'fasting' in name_lower and ('glucose' in name_lower or 'sugar' in name_lower):
                    if numeric_val > 200:
                        is_abnormal = True
                        clinical_alert = f"CRITICAL HYPERGLYCEMIA: Fasting glucose {numeric_val} mg/dL is critically high (> 200 mg/dL). Immediate medical attention recommended."
                        alerts.append(clinical_alert)
                    elif numeric_val > 125:
                        is_abnormal = True
                        clinical_alert = f"Elevated: Fasting blood glucose {numeric_val} mg/dL is above normal threshold (70-100 mg/dL)."
                    elif numeric_val < 70:
                        is_abnormal = True
                        clinical_alert = f"HYPOGLYCEMIA ALERT: Fasting blood glucose {numeric_val} mg/dL is below safe threshold (< 70 mg/dL)."
                        alerts.append(clinical_alert)

                elif ('post' in name_lower or 'pp' in name_lower) and ('glucose' in name_lower or 'sugar' in name_lower):
                    if numeric_val > 200:
                        is_abnormal = True
                        clinical_alert = f"HIGH BLOOD SUGAR ALERT: Post-prandial glucose {numeric_val} mg/dL exceeds 200 mg/dL."
                        alerts.append(clinical_alert)
                    elif numeric_val > 140:
                        is_abnormal = True
                        clinical_alert = f"Elevated: Post-prandial glucose {numeric_val} mg/dL is above normal threshold (< 140 mg/dL)."

                # 2. HbA1c Glycated Hemoglobin
                elif 'hba1c' in name_lower or 'glycated' in name_lower:
                    if numeric_val >= 6.5:
                        is_abnormal = True
                        clinical_alert = f"HbA1c of {numeric_val}% indicates diabetic range (Normal < 5.7%)."
                    elif numeric_val >= 5.7:
                        is_abnormal = True
                        clinical_alert = f"HbA1c of {numeric_val}% indicates pre-diabetes range (5.7 - 6.4%)."

                # 3. Blood Pressure
                elif 'systolic' in name_lower or 'bp systolic' in name_lower:
                    if numeric_val > 180:
                        is_abnormal = True
                        clinical_alert = f"HYPERTENSIVE CRISIS RISK: Systolic BP {numeric_val} mmHg exceeds 180 mmHg."
                        alerts.append(clinical_alert)
                    elif numeric_val >= 140:
                        is_abnormal = True
                        clinical_alert = f"Stage 2 Hypertension: Systolic BP {numeric_val} mmHg (Normal < 120 mmHg)."

                # 4. Cholesterol LDL
                elif 'ldl' in name_lower:
                    if numeric_val > 130:
                        is_abnormal = True
                        clinical_alert = f"Elevated LDL Cholesterol: {numeric_val} mg/dL (Optimal < 100 mg/dL)."

                # 5. Serum Creatinine
                elif 'creatinine' in name_lower:
                    if numeric_val > 1.3:
                        is_abnormal = True
                        clinical_alert = f"Elevated Serum Creatinine: {numeric_val} mg/dL (Normal 0.7 - 1.3 mg/dL)."
                        alerts.append(clinical_alert)

            evaluated_biomarkers.append(
                BiomarkerValue(
                    name=bm.name,
                    value=bm.value,
                    reference=bm.reference,
                    isAbnormal=is_abnormal,
                    clinicalAlert=clinical_alert
                )
            )

        return evaluated_biomarkers, alerts

    @staticmethod
    def check_drug_contraindications(medications_to_check: List[str], patient_allergies: List[Allergy]) -> List[str]:
        """
        Cross-checks medications against patient documented drug allergies.
        Detects beta-lactams, penicillins, cephalosporins, and sulfonamides.
        """
        contraindication_warnings: List[str] = []

        beta_lactam_classes = ['penicillin', 'amoxicillin', 'ampicillin', 'augmentin', 'piperacillin', 'methicillin']
        cephalosporin_classes = ['cefuroxime', 'cephalexin', 'ceftriaxone', 'cefixime', 'cefepime']
        sulfa_classes = ['sulfamethoxazole', 'bactrim', 'cotrimoxazole', 'sulfadiazine', 'sulfa']

        def get_substance(a) -> str:
            if isinstance(a, dict):
                return a.get("substance", "").lower()
            return getattr(a, "substance", "").lower()

        has_penicillin_allergy = any('penicillin' in get_substance(a) or 'amoxicillin' in get_substance(a) for a in patient_allergies)
        has_sulfa_allergy = any('sulfa' in get_substance(a) or 'sulfonamide' in get_substance(a) for a in patient_allergies)

        for med in medications_to_check:
            med_lower = med.lower().strip()

            if has_penicillin_allergy:
                if any(bl in med_lower for bl in beta_lactam_classes):
                    contraindication_warnings.append(
                        f"CRITICAL CONTRAINDICATION: '{med}' is a Penicillin-class beta-lactam. Severe risk of anaphylaxis in this patient!"
                    )
                elif any(ceph in med_lower for ceph in cephalosporin_classes):
                    contraindication_warnings.append(
                        f"HIGH-RISK WARNING: '{med}' is a Cephalosporin. Documented 10-15% cross-reactivity with Penicillin allergies."
                    )

            if has_sulfa_allergy:
                if any(sf in med_lower for sf in sulfa_classes):
                    contraindication_warnings.append(
                        f"CRITICAL CONTRAINDICATION: '{med}' contains Sulfonamides. Patient has documented severe allergy."
                    )

        return contraindication_warnings
