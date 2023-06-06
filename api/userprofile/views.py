from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, \
    get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.permissions import IsFriend
from .models import Profile
from .serializers import ProfileDetailSerializer, ProfileAvatarSerializer, UserProfileSerializer, \
    ProfileAboutSerializer, ProfileSuggestionSerializer, CompanyStaffProfileSerializer
from account.models import MyUser
from notification.models import Notification
from random import sample


class ProfileList(ListAPIView):
    serializer_class = ProfileDetailSerializer
    queryset = Profile.objects.filter(user__is_superuser=False, user__is_staff=False, user__role='FRIEND')
    permission_classes = [IsAuthenticated, ]


class UserProfileByUsername(RetrieveUpdateAPIView):
    queryset = Profile.objects.filter()
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'
    permission_classes = (IsAuthenticated, )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.user.username != request.user.username:
            raise PermissionDenied("You do not have permission to perform this action.")
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def get_serializer_class(self):
        profile = self.get_object()
        if profile.user.role == 'FRIEND':
            return UserProfileSerializer
        return CompanyStaffProfileSerializer


class FollowAndUnfollowView(APIView):
    permission_classes = (IsAuthenticated, IsFriend)

    def post(self, request, username):
        my_profile = Profile.objects.get(user=request.user)
        user = get_object_or_404(MyUser, username=username)
        profile = user.profile

        if profile.user in my_profile.following.all():
            my_profile.following.remove(profile.user)
            profile.follower.remove(my_profile.user)
            notification = Notification(sender=request.user, receiver=user, type="U")
            notification.save()
            message = "Unfollowed user successfully."

        else:
            my_profile.following.add(profile.user)
            profile.follower.add(my_profile.user)
            notification = Notification(sender=request.user, receiver=user, type="F")
            notification.save()
            message = "Followed user successfully."

        return Response({"message": message, "user": UserProfileSerializer(request.user.profile).data})


class FollowerListAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, username):
        user = get_object_or_404(MyUser, username=username)
        followers = user.profile.follower.all()

        data = [{
            'username': follower.username,
            'first_name': follower.first_name,
            'last_name': follower.last_name,
            'email': follower.email,
            'avatar': follower.profile.avatar.url if follower.profile.user and follower.profile.avatar and follower.profile.avatar.url else None,
        } for follower in followers]

        return Response(data)


class FollowingListAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, username):
        user = get_object_or_404(MyUser, username=username)
        followings = user.profile.following.all()

        data = [{
            'username': following.username,
            'first_name': following.first_name,
            'last_name': following.last_name,
            'email': following.email,
            'avatar': following.profile.avatar.url if following.profile.user and following.profile.avatar and following.profile.avatar.url else None,
        } for following in followings]

        return Response(data)


class UserAboutAPIView(generics.UpdateAPIView):
    serializer_class = ProfileAboutSerializer
    permission_classes = (IsAuthenticated, )

    def get_object(self):
        return self.request.user.profile


class UserAvatarAPIView(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileAvatarSerializer
    permission_classes = (IsAuthenticated, )

    def get_object(self):
        return self.request.user.profile


class GetSuggestionProfiles(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ProfileSuggestionSerializer

    def get_queryset(self):
        user = self.request.user
        following_profiles = user.profile.following.all()

        suggested_profiles = Profile.objects.exclude(user=user.profile.user).exclude(user__in=following_profiles).filter(user__role='FRIEND', education_level=user.profile.education_level)
        random_profiles = sample(list(suggested_profiles), min(10, suggested_profiles.count()))

        return random_profiles


class GetSearchProfiles(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = ProfileSuggestionSerializer

    def get_queryset(self):
        query = self.request.GET.get('username', '')
        print(query)
        results = Profile.objects.filter(user__username__icontains=query, user__role='FRIEND')
        return results