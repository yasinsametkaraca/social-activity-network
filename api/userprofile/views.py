from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, \
    RetrieveAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from .serializers import ProfileSerializer, ProfileDetailSerializer, ProfileAvatarSerializer, UserProfileSerializer
from account.models import MyUser
from notification.models import Notification


class ProfileList(ListAPIView):
    serializer_class = ProfileDetailSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]


class ProfileApi(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile


class UserAvatarAPIView(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileAvatarSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile


class UserProfileRetrieveUpdate(RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class UserProfileByUsername(RetrieveAPIView):
    serializer_class = UserProfileSerializer
    queryset = Profile.objects.all()
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'


class FollowAndUnfollowView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        my_profile = Profile.objects.get(user=request.user)
        username = request.data['username']
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

        return Response({"message": message})


class FollowerListAPIView(APIView):
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
