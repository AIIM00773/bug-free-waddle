

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions


class RecoverPasswordView (APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self,request):
        data = request.data
        phone = data.get("phone", "").strip()
        email = data.get("email","").strip().lower()

        if  not phone or not email :
            return Response({"error":"Phone and Email Is required For Account Password Reset"})
            
        return Response({"message":"Reset Link Has Been Sent to your Email and Reset Code to Your Number , use them to Reset passcode "},)
