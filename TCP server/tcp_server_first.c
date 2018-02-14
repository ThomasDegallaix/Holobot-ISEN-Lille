#include "inet_socket.h"
#include <unistd.h>
#include <stdio.h>
#include <errno.h>
#include <arpa/inet.h>
#include <fcntl.h>

#define MAX_CLIENTS 100

const int BACKLOG = 5;
const int BUF_SIZE = 100;

int make_non_block(int fd) {
    return fcntl(fd, F_SETFL, O_NONBLOCK);
}

int insert_client(int clients[MAX_CLIENTS], int fd)
{
  int i = 0;
  for(; i < MAX_CLIENTS && clients[i] != 0; ++i);

  if (i == MAX_CLIENTS)
    return -1;

  clients[i] = fd;

  return i;
}

int remove_client(int clients[MAX_CLIENTS], int fd)
{
  int i = 0;
  for (; i < MAX_CLIENTS && clients[i] != fd; ++i);

  if (i == MAX_CLIENTS)
    return -1;

  clients[i] = 0;

  return i;
}

int main()
{
  int server = inetListen("55555", BACKLOG, NULL);

  char buf[BUF_SIZE + 1];

  int clients[MAX_CLIENTS] = {0};

  struct sockaddr_storage client_addr;
  char client_addr_str[INET6_ADDRSTRLEN];

  make_non_block(server);

  for (;;) {

    socklen_t client_addr_len = sizeof(struct sockaddr_storage);
    int clientfd = accept(server,(struct sockaddr*)&client_addr, &client_addr_len);
    if (clientfd > 0) {
      inetAddressStr((struct sockaddr*)&client_addr, client_addr_len,
          client_addr_str, INET6_ADDRSTRLEN);
      printf("New client : %s\n", client_addr_str);
      if (insert_client(clients, clientfd) == -1) {
        close(clientfd);
      } else {
	make_non_block(clientfd);
      }
    }

    for (int i = 0; i < MAX_CLIENTS; ++i) {
      if (clients[i] == 0)
	continue;
      int nread = read(clients[i], buf, BUF_SIZE);
      if (nread == 0)
      {
	remove_client(clients, clientfd);
	close(clientfd);
      } else if (nread > 0) {
      	buf[nread] = 0;
        printf("Data : %s\n", buf);
      }
    }

  }

  return 0;
}
