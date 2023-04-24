from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Comment
from activity.models import Activity, ActivityUser
from account.models import MyUser
from django.test import override_settings
from api.settings import TEST_DIR


@override_settings(MEDIA_ROOT=(TEST_DIR + 'media/'))
class CommentTests(TestCase):

    def setUp(self):
        self.user = MyUser.objects.create_user(
            username='testuser',
            email='testuser@test.com',
            password='Asdfg.38'
        )
        self.friend = MyUser.objects.create_user(
            username='testfriend',
            email='testfriend@test.com',
            password='Asdfg.38'
        )
        self.activity = Activity.objects.create(
            title='Test Activity',
            description='Test description',
            owner=self.user
        )
        self.activity_user = ActivityUser.objects.create(
            activity=self.activity,
            user=self.user,
            participate_status=True
        )
        self.activity_user = ActivityUser.objects.create(
            activity=self.activity,
            user=self.friend,
            participate_status=True
        )
        self.private_comment = Comment.objects.create(
            owner=self.user,
            activity=self.activity,
            comment='Test private comment',
            is_public=False
        )
        self.public_comment = Comment.objects.create(
            owner=self.user,
            activity=self.activity,
            comment='Test public comment',
            is_public=True
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_comment(self):
        url = reverse('comment_list_create')
        data = {
            'activity': self.activity.pk,
            'comment': 'Test comment',
            'is_public': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 3)

    def test_list_comments(self):
        url = reverse('comment_list_create')
        response = self.client.get(url, {'activity': self.activity.pk})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_private_comments(self):
        url = reverse('comment_list_create')
        response = self.client.get(url, {'activity': self.activity.pk, 'is_public': False})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_comment(self):
        url = reverse('comment_retrieve_update_destroy', args=[self.public_comment.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.public_comment.pk)
        self.assertEqual(response.data['comment'], 'Test public comment')

    def test_update_comment(self):
        url = reverse('comment_retrieve_update_destroy', args=[self.public_comment.pk])
        data = {'comment': 'Updated comment'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Comment.objects.get(pk=self.public_comment.pk).comment, 'Updated comment')

    def test_delete_comment(self):
        url = reverse('comment_retrieve_update_destroy', args=[self.public_comment.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 1)
